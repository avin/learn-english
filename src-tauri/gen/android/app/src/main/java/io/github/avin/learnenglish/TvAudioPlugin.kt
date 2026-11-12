package io.github.avin.learnenglish

import android.app.Activity
import android.content.Intent
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import app.tauri.annotation.Command
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.Invoke
import app.tauri.plugin.Plugin
import app.tauri.plugin.PluginManager
import org.json.JSONObject

@TauriPlugin
class TvAudioPlugin(activity: Activity) : Plugin(activity) {
  private val mainExecutor = ContextCompat.getMainExecutor(activity.applicationContext)

  @Command
  fun request(invoke: Invoke) = mainExecutor.execute {
    try {
      val activity = checkNotNull(PluginManager.activity as? MainActivity) {
        "TV audio activity is unavailable"
      }
      val args = invoke.getArgs()
      val action = args.getString("action")
      val id = args.getLong("id")
      val service = Intent(activity, TvAudioService::class.java)
      when (action) {
        "start" -> {
          val webView = activity.tvWebView
          val language = args.getString("sourceLanguage")
          require(language == "ru" || language == "en")
          val rows = args.getJSONArray("rows")
          val phrases = List(rows.length()) { index ->
            val row = rows.getJSONObject(index)
            TvAudioService.Phrase(row.getInt("idx"), clip(row, "ru"), clip(row, "en"))
          }
          val selected = args.getInt("selected")
          val position = phrases.indexOfFirst { it.idx == selected }
          require(position >= 0)
          val lesson = TvAudioService.Lesson(
            id, language, phrases, position,
            args.getBoolean("resetOnLessonEnd"), args.getBoolean("announceRestart"),
          ) { state ->
            if (PluginManager.activity === activity) {
              webView.evaluateJavascript(
                "window.dispatchEvent(new CustomEvent('android-tv-audio', {detail: $state}))",
                null,
              )
            }
          }
          activity.startService(service)
          TvAudioService.pending?.invoke?.reject("TV audio session was replaced")
          val cue = args.optString("cue").takeIf {
            it == "sounds/lesson-next.wav" || it == "sounds/lesson-previous.wav"
          }
          val course = args.optString("course")
          val lessonKey = args.optString("lesson")
          val file = args.optString("file")
          val ids = args.optJSONArray("lessons")
          val catalog = if ((course == "titan" || course == "express") && lessonKey.isNotEmpty()) {
            TvAudioService.Catalog(
              course,
              if (ids == null) emptyList() else List(ids.length()) { ids.getString(it) },
              lessonKey,
              if (file == "words") "words" else "tasks",
            )
          } else null
          TvAudioService.pending = TvAudioService.Start(
            lesson, invoke, cue, !args.has("play") || args.getBoolean("play"), catalog,
          )
        }
        "stop" -> {
          if (TvAudioService.pending == null && TvAudioService.current?.lessonId == id) {
            activity.stopService(service)
          }
          invoke.resolve()
        }
        else -> {
          val playback = checkNotNull(TvAudioService.current?.takeIf { it.lessonId == id }) {
            "TV audio session has ended"
          }
          playback.control(action, args)
          invoke.resolve()
        }
      }
    } catch (error: Exception) {
      invoke.reject("TV audio: ${error.message}", error)
    }
  }

  override fun onDestroy(activity: AppCompatActivity) {
    TvAudioService.pending?.invoke?.reject("TV audio session has ended")
    TvAudioService.pending = null
    activity.stopService(Intent(activity, TvAudioService::class.java))
  }

  private fun clip(row: JSONObject, language: String): TvAudioService.Clip {
    val path = row.optJSONObject("audio")?.optString(language)?.takeIf { it.isNotEmpty() }
    val asset = path?.let(Uri::decode)?.takeIf {
      it.startsWith("translations/") && it.endsWith(".m4a") &&
        '\\' !in it && ':' !in it && it.split('/').none { part -> part.isEmpty() || part.endsWith('.') || part.endsWith(' ') }
    }
    return TvAudioService.Clip(row.getString(language), language, asset)
  }
}
