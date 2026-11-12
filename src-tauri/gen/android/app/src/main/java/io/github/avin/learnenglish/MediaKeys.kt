package io.github.avin.learnenglish

import android.content.Context
import android.content.Intent
import android.media.session.MediaSession
import android.media.session.PlaybackState
import android.os.Handler
import android.os.Looper
import android.view.KeyEvent
import app.tauri.plugin.PluginManager
import org.json.JSONObject

internal object MediaKeys {
  private val keys = setOf("next", "previous", "play", "pause")
  private val phases = setOf("down", "up")
  private var session: MediaSession? = null
  private var owners = 0

  fun attach(context: Context) {
    owners++
    if (session != null) return
    val main = Handler(Looper.getMainLooper())
    session = MediaSession(context.applicationContext, "Lesson").apply {
      @Suppress("DEPRECATION")
      setFlags(MediaSession.FLAG_HANDLES_MEDIA_BUTTONS or MediaSession.FLAG_HANDLES_TRANSPORT_CONTROLS)
      setCallback(MediaKeyCallback(), main)
      setPlaybackState(
        PlaybackState.Builder()
          .setActions(
            PlaybackState.ACTION_PLAY or PlaybackState.ACTION_PAUSE or
              PlaybackState.ACTION_PLAY_PAUSE or PlaybackState.ACTION_SKIP_TO_NEXT or
              PlaybackState.ACTION_SKIP_TO_PREVIOUS,
          )
          .setState(PlaybackState.STATE_PAUSED, PlaybackState.PLAYBACK_POSITION_UNKNOWN, 0f)
          .build(),
      )
      isActive = TvAudioService.current == null
    }
  }

  fun yieldToPlayback() {
    session?.isActive = false
  }

  fun resume() {
    if (TvAudioService.current == null) session?.isActive = true
  }

  fun release() {
    owners = (owners - 1).coerceAtLeast(0)
    if (owners > 0) return
    session?.release()
    session = null
  }

  fun dispatch(key: String, phase: String) {
    if (key !in keys || phase !in phases) return
    val activity = PluginManager.activity as? MainActivity ?: return
    if (!activity::tvWebView.isInitialized) return
    val detail = JSONObject().put("key", key).put("phase", phase)
    activity.tvWebView.post {
      if (PluginManager.activity !== activity) return@post
      activity.tvWebView.evaluateJavascript(
        "window.dispatchEvent(new CustomEvent('android-media-key',{detail:$detail}))",
        null,
      )
    }
  }
}

internal open class MediaKeyCallback : MediaSession.Callback() {
  override fun onSkipToNext() = tap("next")
  override fun onSkipToPrevious() = tap("previous")
  override fun onPlay() = tap("play")
  override fun onPause() = tap("pause")

  @Suppress("DEPRECATION")
  override fun onMediaButtonEvent(intent: Intent): Boolean {
    val event = intent.getParcelableExtra<KeyEvent>(Intent.EXTRA_KEY_EVENT) ?: return false
    val key = when (event.keyCode) {
      KeyEvent.KEYCODE_MEDIA_NEXT -> "next"
      KeyEvent.KEYCODE_MEDIA_PREVIOUS -> "previous"
      KeyEvent.KEYCODE_MEDIA_PLAY, KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE,
      KeyEvent.KEYCODE_HEADSETHOOK -> "play"
      KeyEvent.KEYCODE_MEDIA_PAUSE -> "pause"
      else -> return super.onMediaButtonEvent(intent)
    }
    if (event.action == KeyEvent.ACTION_DOWN) {
      if (event.repeatCount == 0) MediaKeys.dispatch(key, "down")
    } else if (event.action == KeyEvent.ACTION_UP) {
      MediaKeys.dispatch(key, "up")
    }
    return true
  }

  private fun tap(key: String) {
    MediaKeys.dispatch(key, "down")
    MediaKeys.dispatch(key, "up")
  }
}
