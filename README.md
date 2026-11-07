# Тренажёр перевода

Переводческий тренажер по курсам канала ["Английский по плейлистам"](https://www.youtube.com/@englishplaylists/playlists)

[ >> [Открыть](https://avin.github.io/learn-english) << ]

## Офлайн-приложения

В разделе [Releases](https://github.com/avin/learn-english/releases) публикуются APK для Android ARM64 и установщик для Windows x64. Внутри оба курса и все готовые записи. Прогресс и избранное хранятся на устройстве.

Чтобы выпустить версию, отправьте тег с коммита в `master`.

```sh
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions берёт номер версии из тега и публикует релиз после успешной сборки обеих платформ. Для подписи APK workflow использует секреты `ANDROID_SIGNING_KEY_BASE64` (файл PKCS#12 в Base64 с ключом `learn-english`) и `ANDROID_SIGNING_PASSWORD`. Для следующих релизов нужен тот же ключ, чтобы Android мог обновить приложение с сохранением данных.

Для локальной сборки после установки [инструментов Tauri](https://v2.tauri.app/start/prerequisites/) и `npm ci` используйте `npm run tauri -- build` на Windows или `npm run tauri -- android build --apk --target aarch64` для Android. Локальный APK потребуется подписать перед установкой.
