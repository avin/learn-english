package io.github.avin.learnenglish

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.media.AudioAttributes
import android.media.AudioFocusRequest
import android.media.AudioManager
import android.media.MediaMetadata
import android.media.MediaPlayer
import android.media.session.MediaSession
import android.media.session.PlaybackState
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.os.PowerManager
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.view.KeyEvent
import app.tauri.plugin.Invoke
import org.json.JSONArray
import org.json.JSONObject
import java.util.Locale

class TvAudioService : Service() {
  internal data class Clip(val text: String, val language: String, val asset: String?)
  internal data class Phrase(val idx: Int, val ru: Clip, val en: Clip) {
    fun clip(language: String) = if (language == "ru") ru else en
  }
  internal data class Lesson(
    val id: Long,
    val source: String,
    val phrases: List<Phrase>,
    val position: Int,
    val update: (JSONObject) -> Unit,
  )
  internal data class Start(val lesson: Lesson, val invoke: Invoke)

  companion object {
    internal var pending: Start? = null
    internal var current: TvAudioService? = null
    private const val CHANNEL = "tv-audio"
    private const val NOTIFICATION_ID = 1
  }

  private val main = Handler(Looper.getMainLooper())
  private val attributes = AudioAttributes.Builder()
    .setUsage(AudioAttributes.USAGE_MEDIA)
    .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
    .build()
  private val audioManager by lazy { getSystemService(AudioManager::class.java) }
  private val focusListener = AudioManager.OnAudioFocusChangeListener { change ->
    if (change < 0) finishClip()
  }
  private val focusRequest by lazy {
    AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN)
      .setAudioAttributes(attributes)
      .setOnAudioFocusChangeListener(focusListener, main)
      .build()
  }
  private lateinit var session: MediaSession
  private var lesson: Lesson? = null
  internal val lessonId get() = lesson?.id
  private var phrases = emptyList<Phrase>()
  private var position = 0
  private var revealed = false
  private var player: MediaPlayer? = null
  private var speech: TextToSpeech? = null
  private var speechStatus: Int? = null
  private var pendingSpeech: Clip? = null
  private var utterance = 0L
  private var hasFocus = false

  override fun onBind(intent: Intent?): IBinder? = null

  @Suppress("DEPRECATION")
  override fun onCreate() {
    super.onCreate()
    session = MediaSession(this, "TV lesson")
    session.setFlags(MediaSession.FLAG_HANDLES_MEDIA_BUTTONS or MediaSession.FLAG_HANDLES_TRANSPORT_CONTROLS)
    session.setCallback(object : MediaSession.Callback() {
      override fun onSkipToNext() = control("next")
      override fun onSkipToPrevious() = control("previous")
      override fun onPlay() = control("reveal")
      override fun onPause() = finishClip()
      override fun onStop() = stopSelf()

      @Suppress("DEPRECATION")
      override fun onMediaButtonEvent(intent: Intent): Boolean {
        val event = intent.getParcelableExtra<KeyEvent>(Intent.EXTRA_KEY_EVENT) ?: return false
        val action = when (event.keyCode) {
          KeyEvent.KEYCODE_MEDIA_NEXT -> "next"
          KeyEvent.KEYCODE_MEDIA_PREVIOUS -> "previous"
          KeyEvent.KEYCODE_MEDIA_PLAY, KeyEvent.KEYCODE_MEDIA_PAUSE,
          KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE, KeyEvent.KEYCODE_HEADSETHOOK -> "reveal"
          else -> return super.onMediaButtonEvent(intent)
        }
        if (event.action == KeyEvent.ACTION_DOWN && event.repeatCount == 0) control(action)
        return true
      }
    }, main)
    current = this
  }

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    val start = pending
    pending = null
    if (start != null) {
      try {
        lesson = start.lesson
        phrases = start.lesson.phrases
        position = start.lesson.position
        revealed = false
        session.isActive = true
        startForeground(NOTIFICATION_ID, notification())
        playCurrent()
        start.invoke.resolve()
      } catch (error: Exception) {
        start.invoke.reject("TV audio: ${error.message}", error)
        stopSelf()
      }
    } else if (lesson == null) {
      stopSelf()
    } else {
      intent?.action?.let(::control)
    }
    return START_NOT_STICKY
  }

  internal fun control(action: String) {
    if (lesson == null) return
    var completed = false
    when (action) {
      "next" -> {
        if (position == phrases.lastIndex) {
          phrases = phrases.shuffled()
          position = 0
          completed = true
        } else position++
      }
      "previous" -> {
        if (position == 0) return
        position--
      }
      "source", "reveal" -> Unit
      else -> error("Unknown TV audio action")
    }
    if (action == "next" || action == "previous") revealed = false
    val target = action == "reveal"
    if (target) revealed = true
    playCurrent(target, completed)
  }

  @Suppress("DEPRECATION")
  private fun playCurrent(target: Boolean = false, completed: Boolean = false) {
    val active = lesson ?: return
    val phrase = phrases[position]
    val language = if (!target) active.source else if (active.source == "ru") "en" else "ru"
    val clip = phrase.clip(language)
    finishClip()
    session.setMetadata(MediaMetadata.Builder().putString(MediaMetadata.METADATA_KEY_TITLE, clip.text).build())
    active.update(JSONObject().put("id", active.id).put("idx", phrase.idx)
      .put("column", language).put("revealed", revealed).put("order", JSONArray(phrases.map { it.idx })))
    hasFocus = (if (Build.VERSION.SDK_INT >= 26) audioManager.requestAudioFocus(focusRequest)
      else audioManager.requestAudioFocus(focusListener, AudioManager.STREAM_MUSIC, AudioManager.AUDIOFOCUS_GAIN)) ==
      AudioManager.AUDIOFOCUS_REQUEST_GRANTED
    if (!hasFocus) return
    setPlaybackState(PlaybackState.STATE_PLAYING)
    if (completed) playAsset("sounds/lesson-complete.wav") { playClip(clip) }
    else playClip(clip)
  }

  private fun playClip(clip: Clip) {
    if (clip.asset != null) playAsset(clip.asset) { failed -> if (failed) speak(clip) else finishClip() }
    else speak(clip)
  }

  private fun playAsset(path: String, done: (failed: Boolean) -> Unit) {
    val media = MediaPlayer()
    player = media
    fun complete(failed: Boolean) {
      if (player !== media) return
      player = null
      media.release()
      done(failed)
    }
    try {
      media.setAudioAttributes(attributes)
      media.setWakeMode(this, PowerManager.PARTIAL_WAKE_LOCK)
      assets.openFd("public/$path").use { media.setDataSource(it.fileDescriptor, it.startOffset, it.length) }
      media.setOnPreparedListener { if (player === media) media.start() }
      media.setOnCompletionListener { complete(false) }
      media.setOnErrorListener { _, _, _ -> complete(true); true }
      media.prepareAsync()
    } catch (error: Exception) {
      complete(true)
    }
  }

  private fun speak(clip: Clip) {
    val engine = speech
    if (engine == null) {
      pendingSpeech = clip
      speech = TextToSpeech(this) { status ->
        main.post {
          if (speech == null) return@post
          speechStatus = status
          val next = pendingSpeech
          pendingSpeech = null
          if (next != null) speak(next)
        }
      }.apply {
        setAudioAttributes(attributes)
        setOnUtteranceProgressListener(object : UtteranceProgressListener() {
          override fun onStart(id: String) = Unit
          override fun onDone(id: String) = finishSpeech(id)
          @Deprecated("Required by UtteranceProgressListener")
          override fun onError(id: String) = finishSpeech(id)
          override fun onError(id: String, code: Int) = finishSpeech(id)
        })
      }
    } else if (speechStatus == null) {
      pendingSpeech = clip
    } else if (speechStatus != TextToSpeech.SUCCESS ||
      engine.setLanguage(Locale.forLanguageTag(clip.language)) < 0 ||
      engine.speak(clip.text, TextToSpeech.QUEUE_FLUSH, null, (++utterance).toString()) == TextToSpeech.ERROR
    ) {
      finishClip()
    }
  }

  private fun finishSpeech(id: String) {
    main.post { if (id == utterance.toString()) finishClip() }
  }

  @Suppress("DEPRECATION")
  private fun finishClip() {
    utterance++
    pendingSpeech = null
    player?.release()
    player = null
    speech?.stop()
    if (hasFocus) {
      hasFocus = false
      if (Build.VERSION.SDK_INT >= 26) audioManager.abandonAudioFocusRequest(focusRequest)
      else audioManager.abandonAudioFocus(focusListener)
    }
    setPlaybackState(PlaybackState.STATE_PAUSED)
  }

  private fun setPlaybackState(state: Int) {
    session.setPlaybackState(PlaybackState.Builder()
      .setActions(PlaybackState.ACTION_PLAY or PlaybackState.ACTION_PAUSE or
        PlaybackState.ACTION_PLAY_PAUSE or PlaybackState.ACTION_SKIP_TO_PREVIOUS or PlaybackState.ACTION_SKIP_TO_NEXT)
      .setState(state, PlaybackState.PLAYBACK_POSITION_UNKNOWN, if (state == PlaybackState.STATE_PLAYING) 1f else 0f)
      .build())
  }

  @Suppress("DEPRECATION")
  private fun notification(): Notification {
    val title = getString(R.string.tv_audio_title)
    val builder = if (Build.VERSION.SDK_INT >= 26) {
      getSystemService(NotificationManager::class.java).createNotificationChannel(
        NotificationChannel(CHANNEL, title, NotificationManager.IMPORTANCE_LOW),
      )
      Notification.Builder(this, CHANNEL)
    } else Notification.Builder(this)
    val openApp = PendingIntent.getActivity(this, 0, Intent(this, MainActivity::class.java), PendingIntent.FLAG_IMMUTABLE)
    session.setSessionActivity(openApp)
    return builder.setSmallIcon(android.R.drawable.ic_media_play)
      .setContentTitle(title)
      .setContentIntent(openApp)
      .setVisibility(Notification.VISIBILITY_PUBLIC)
      .setStyle(Notification.MediaStyle().setMediaSession(session.sessionToken))
      .build()
  }

  override fun onTaskRemoved(rootIntent: Intent?) = stopSelf()

  override fun onDestroy() {
    current = null
    finishClip()
    speech?.shutdown()
    speech = null
    session.release()
    lesson?.let { it.update(JSONObject().put("id", it.id).put("closed", true)) }
    super.onDestroy()
  }
}
