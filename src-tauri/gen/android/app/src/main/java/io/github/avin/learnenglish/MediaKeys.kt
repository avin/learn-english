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
  private var session: MediaSession? = null
  private var owners = 0
  private var generation = 0L
  private var context: String? = null
  private val handler by lazy { MediaKeyHandler(::dispatch) }

  fun handle(event: KeyEvent): Boolean = handler.handle(event)

  fun tap(key: String) {
    if (key in keys) handler.tap(key)
  }

  fun cancel() {
    generation++
    handler.cancel()
  }

  fun setContext(context: String) {
    cancel()
    this.context = context
  }

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
    if (TvAudioService.current == null) cancel()
    session?.release()
    session = null
  }

  private fun dispatch(key: String, held: Boolean) {
    val playback = TvAudioService.current
    if (playback != null) {
      playback.handleMediaAction(key, held)
      return
    }
    val activity = PluginManager.activity as? MainActivity ?: return
    val webView = activity.tvWebViewOrNull() ?: return
    val detail = JSONObject().put("key", key).put("held", held).put("context", context)
    val dispatchedGeneration = generation
    webView.post {
      if (generation != dispatchedGeneration || PluginManager.activity !== activity ||
        activity.tvWebViewOrNull() !== webView) return@post
      webView.evaluateJavascript(
        "window.dispatchEvent(new CustomEvent('android-media-key',{detail:$detail}))",
        null,
      )
    }
  }
}

internal open class MediaKeyCallback : MediaSession.Callback() {
  override fun onSkipToNext() = MediaKeys.tap("next")
  override fun onSkipToPrevious() = MediaKeys.tap("previous")
  override fun onPlay() = MediaKeys.tap("play")
  override fun onPause() = MediaKeys.tap("pause")

  @Suppress("DEPRECATION")
  override fun onMediaButtonEvent(intent: Intent): Boolean {
    val event = intent.getParcelableExtra<KeyEvent>(Intent.EXTRA_KEY_EVENT) ?: return false
    return if (MediaKeys.handle(event)) true else super.onMediaButtonEvent(intent)
  }
}
