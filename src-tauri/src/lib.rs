use percent_encoding::percent_decode_str;
use std::{borrow::Cow, path::Path};
use tauri::{
    http::{header::CONTENT_TYPE, HeaderValue, StatusCode},
    path::BaseDirectory,
    Manager, WebviewWindowBuilder,
};
use tauri_plugin_fs::FsExt;

#[cfg(target_os = "android")]
#[tauri::command]
async fn android_tv_audio(
    request: serde_json::Value,
    plugin: tauri::State<'_, tauri::plugin::PluginHandle<tauri::Wry>>,
) -> Result<(), String> {
    plugin
        .run_mobile_plugin_async("request", request)
        .await
        .map_err(|err| err.to_string())
}

fn public_asset(path: &str) -> Option<(&Path, &'static str)> {
    let relative = path.strip_prefix('/')?;
    let path = Path::new(relative);
    if relative.contains(['\\', ':'])
        || relative
            .split('/')
            .any(|part| part.is_empty() || part.ends_with(['.', ' ']))
    {
        return None;
    }

    let mime = match (path.extension()?.to_str()?, relative) {
        ("json", path) if path.starts_with("translations/") => "application/json",
        ("m4a", path) if path.starts_with("translations/") => "audio/mp4",
        ("wav", path) if path.starts_with("sounds/") => "audio/wav",
        ("svg", "favicon.svg") => "image/svg+xml",
        _ => return None,
    };
    Some((path, mime))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default();
    #[cfg(target_os = "android")]
    let builder =
        builder
            .plugin(
                tauri::plugin::Builder::<_, ()>::new("tv-audio")
                    .setup(|app, api| {
                        app.manage(api.register_android_plugin(
                            "io.github.avin.learnenglish",
                            "TvAudioPlugin",
                        )?);
                        Ok(())
                    })
                    .build(),
            )
            .invoke_handler(tauri::generate_handler![android_tv_audio]);

    builder
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            let handle = app.handle().clone();
            #[cfg(target_os = "android")]
            let asset_reads = std::sync::Mutex::new(());
            WebviewWindowBuilder::from_config(app, &app.config().app.windows[0])?
                .on_web_resource_request(move |request, response| {
                    if tauri::is_dev() {
                        return;
                    }
                    let Ok(path) = percent_decode_str(request.uri().path()).decode_utf8() else {
                        return;
                    };
                    let Some((path, mime)) = public_asset(&path) else {
                        return;
                    };

                    // Serve course files at their web URLs without embedding them in the binary.
                    let bytes = handle
                        .path()
                        .resolve(Path::new("public").join(path), BaseDirectory::Resource)
                        .ok()
                        .and_then(|path| {
                            // Android's filesystem plugin copies each asset to a shared cache file.
                            #[cfg(target_os = "android")]
                            let _guard = asset_reads.lock().ok()?;
                            handle.fs().read(path).ok()
                        });
                    if let Some(bytes) = bytes {
                        response
                            .headers_mut()
                            .insert(CONTENT_TYPE, HeaderValue::from_static(mime));
                        *response.body_mut() = Cow::Owned(bytes);
                    } else {
                        *response.status_mut() = StatusCode::NOT_FOUND;
                        *response.body_mut() = Cow::Borrowed(&[]);
                    }
                })
                .build()?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("failed to run Learn English");
}

#[cfg(test)]
mod tests {
    use super::public_asset;

    #[test]
    fn serves_only_expected_public_paths() {
        let (_, mime) =
            public_asset("/translations/express/A0 1-2/audio/tasks_001_ru.m4a").unwrap();
        assert_eq!(mime, "audio/mp4");
        assert!(public_asset("/translations/../secrets.json").is_none());
        assert!(public_asset("/translations/.. /secrets.json").is_none());
        assert!(public_asset("/translations/lesson/..\\secrets.json").is_none());
        assert!(public_asset("/package.json").is_none());
    }
}
