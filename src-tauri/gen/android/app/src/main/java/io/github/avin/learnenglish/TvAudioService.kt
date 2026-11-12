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
    val resetOnLessonEnd: Boolean,
    val announceRestart: Boolean,
    val update: (JSONObject) -> Unit,
  )
  internal data class Catalog(
    val course: String,
    val lessons: List<String>,
    var lesson: String,
    val file: String,
  )
  internal data class Start(
    val lesson: Lesson,
    val invoke: Invoke,
    val cue: String?,
    val play: Boolean,
    val catalog: Catalog?,
  )

  companion object {
    internal var pending: Start? = null
    internal var current: TvAudioService? = null
    private const val CHANNEL = "tv-audio"
    private const val NOTIFICATION_ID = 1
    private const val MEDIA_HOLD_MS = 1501L
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
  private var target = false
  private var positioned = false
  private var catalog: Catalog? = null
  private val mediaHolds = mutableMapOf<String, Runnable>()
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
    session = MediaSession(this, "Lesson")
    session.setFlags(MediaSession.FLAG_HANDLES_MEDIA_BUTTONS or MediaSession.FLAG_HANDLES_TRANSPORT_CONTROLS)
    session.setCallback(object : MediaSession.Callback() {
      override fun onSkipToNext() = control("right")
      override fun onSkipToPrevious() = control("left")
      override fun onPlay() = control("replay")
      override fun onPause() = control("replay")
      override fun onStop() = stopSelf()

      @Suppress("DEPRECATION")
      override fun onMediaButtonEvent(intent: Intent): Boolean {
        val event = intent.getParcelableExtra<KeyEvent>(Intent.EXTRA_KEY_EVENT) ?: return false
        return if (handleMediaKey(event)) true else super.onMediaButtonEvent(intent)
      }
    }, main)
    current = this
  }

  private fun clearMediaHolds() {
    mediaHolds.values.forEach(main::removeCallbacks)
    mediaHolds.clear()
  }

  private fun handleMediaKey(event: KeyEvent): Boolean {
    val key = when (event.keyCode) {
      KeyEvent.KEYCODE_MEDIA_NEXT -> "next"
      KeyEvent.KEYCODE_MEDIA_PREVIOUS -> "previous"
      KeyEvent.KEYCODE_MEDIA_PLAY, KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE,
      KeyEvent.KEYCODE_HEADSETHOOK -> "play"
      KeyEvent.KEYCODE_MEDIA_PAUSE -> "pause"
      else -> return false
    }
    if (event.action == KeyEvent.ACTION_UP) {
      mediaHolds.remove(key)?.let(main::removeCallbacks)
      return true
    }
    if (event.action != KeyEvent.ACTION_DOWN || event.repeatCount != 0) return true
    val hold = when (key) {
      "next" -> "nextLesson"
      "previous" -> "previousLesson"
      "play" -> "restart"
      else -> null
    }
    if (hold != null) {
      mediaHolds.remove(key)?.let(main::removeCallbacks)
      val runnable = Runnable {
        mediaHolds.remove(key)
        control(hold)
      }
      mediaHolds[key] = runnable
      main.postAtTime(runnable, event.downTime + MEDIA_HOLD_MS)
    }
    control(if (key == "next") "right" else if (key == "previous") "left" else "replay")
    return true
  }

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    val start = pending
    pending = null
    if (start != null) {
      try {
        clearMediaHolds()
        finishClip()
        lesson = start.lesson
        phrases = start.lesson.phrases
        position = start.lesson.position
        revealed = false
        target = false
        positioned = start.play
        catalog = start.catalog
        MediaKeys.yieldToPlayback()
        session.isActive = true
        startForeground(NOTIFICATION_ID, notification())
        if (start.play) playCurrent(cue = start.cue)
        else setPlaybackState(PlaybackState.STATE_PAUSED)
        start.invoke.resolve()
      } catch (error: Exception) {
        start.invoke.reject("TV audio: ${error.message}", error)
        stopSelf()
      }
    } else if (lesson == null) {
      stopSelf()
    } else {
      intent?.action?.let { control(it) }
    }
    return START_NOT_STICKY
  }

  internal fun control(command: String, extra: JSONObject? = null) {
    val active = lesson ?: return
    if (!positioned && command in setOf(
        "right", "left", "up", "down", "replay", "swipeRight", "swipeLeft", "source", "reveal",
      )
    ) {
      positioned = true
      target = false
      revealed = false
      playCurrent()
      return
    }
    val oldPosition = position
    var completed = false
    var reset = false
    var direction: String? = null
    when (command) {
      "nextLesson", "previousLesson" -> {
        switchLesson(if (command == "nextLesson") 1 else -1)
        return
      }
      "select" -> {
        val idx = extra?.optInt("idx", -1) ?: -1
        val column = extra?.optString("column")
        val next = phrases.indexOfFirst { it.idx == idx }
        if (next < 0 || (column != "ru" && column != "en")) return
        position = next
        target = column != active.source
        revealed = target
        positioned = true
        if (position != oldPosition) direction = if (next > oldPosition) "forward" else "backward"
      }
      "boundary" -> {
        finishClip()
        if (beginPlayback()) playAsset("sounds/lesson-unavailable.wav") { finishClip() }
        return
      }
      "right" -> {
        if (!target) {
          target = true
        } else if (position == phrases.lastIndex && active.resetOnLessonEnd) {
          phrases = phrases.shuffled()
          position = 0
          target = false
          completed = true
          reset = true
        } else {
          position = (position + 1) % phrases.size
          target = false
        }
        if (!target) direction = "forward"
        revealed = target
      }
      "left" -> {
        if (!target) {
          position = (position + phrases.lastIndex) % phrases.size
          target = true
        } else target = false
        revealed = target
        if (position != oldPosition) direction = "backward"
      }
      "up", "down" -> {
        val offset = if (command == "up") phrases.lastIndex else 1
        position = (position + offset) % phrases.size
        revealed = target
        if (position != oldPosition) direction = if (command == "up") "backward" else "forward"
      }
      "swipeRight" -> {
        if (!revealed) {
          target = true
          revealed = true
        } else {
          if (position == phrases.lastIndex) {
            phrases = phrases.shuffled()
            position = 0
            completed = true
          } else position++
          target = false
          revealed = false
          direction = "forward"
        }
      }
      "swipeLeft" -> {
        if (position == 0) return
        position--
        target = false
        revealed = false
        direction = "backward"
      }
      "source" -> target = false
      "reveal" -> {
        target = true
        revealed = true
      }
      "sync" -> {
        if (!positioned || phrases.isEmpty()) return
        val phrase = phrases[position]
        val language = if (!target) active.source else if (active.source == "ru") "en" else "ru"
        active.update(playbackState(active, phrase, language, null, false))
        return
      }
      "replay" -> Unit
      "restart" -> {
        phrases = phrases.shuffled()
        position = 0
        target = false
        revealed = false
        positioned = true
        completed = active.announceRestart
        reset = true
        direction = "forward"
      }
      else -> error("Unknown TV audio action")
    }
    playCurrent(target, completed, direction, reset)
  }

  private fun switchLesson(direction: Int) {
    val active = lesson ?: return
    val current = catalog
    val index = current?.lessons?.indexOf(current.lesson) ?: -1
    val next = if (index >= 0) current?.lessons?.getOrNull(index + direction) else null
    val loaded = if (current != null && next != null) loadPhrases(current.course, next, current.file) else null
    if (current == null || next == null || loaded == null) {
      finishClip()
      if (beginPlayback()) playAsset("sounds/lesson-unavailable.wav") { finishClip() }
      active.update(JSONObject().put("id", active.id).put("boundary", true))
      return
    }
    current.lesson = next
    phrases = loaded
    position = 0
    target = false
    revealed = false
    positioned = true
    playCurrent(
      cue = if (direction > 0) "sounds/lesson-next.wav" else "sounds/lesson-previous.wav",
      direction = "forward",
      reset = true,
    )
  }

  private fun loadPhrases(course: String, lessonKey: String, file: String): List<Phrase>? {
    if ((course != "titan" && course != "express") || (file != "tasks" && file != "words")) return null
    if (!lessonKey.matches(Regex("[A-Za-z0-9][A-Za-z0-9 -]{0,40}"))) return null
    return try {
      val rows = JSONArray(assets.open("public/translations/$course/$lessonKey/$file.json")
        .bufferedReader().use { it.readText() })
      if (rows.length() == 0) return null
      List(rows.length()) { index ->
        val row = rows.getJSONObject(index)
        val id = row.getInt("id")
        Phrase(index, taskClip(row, "ru", course, lessonKey, file, id), taskClip(row, "en", course, lessonKey, file, id))
      }
    } catch (error: Exception) {
      null
    }
  }

  private fun taskClip(row: JSONObject, language: String, course: String, lessonKey: String, file: String, id: Int): Clip {
    val phrase = row.getJSONObject(language)
    val asset = if (phrase.optBoolean("audio")) {
      "translations/$course/$lessonKey/audio/${file}_${id.toString().padStart(3, '0')}_$language.m4a"
    } else null
    return Clip(phrase.getString("text"), language, asset)
  }

  private fun playbackState(
    active: Lesson,
    phrase: Phrase,
    language: String,
    direction: String?,
    reset: Boolean,
  ): JSONObject {
    val state = JSONObject().put("id", active.id).put("idx", phrase.idx)
      .put("column", language).put("revealed", revealed).put("order", JSONArray(phrases.map { it.idx }))
      .put("direction", direction).put("reset", reset)
    catalog?.let {
      state.put("lesson", it.lesson).put("section", if (it.file == "words") "dictionary" else "sentences")
    }
    return state
  }

  private fun playCurrent(
    target: Boolean = false,
    completed: Boolean = false,
    direction: String? = null,
    reset: Boolean = false,
    cue: String? = null,
  ) {
    val active = lesson ?: return
    val phrase = phrases[position]
    val language = if (!target) active.source else if (active.source == "ru") "en" else "ru"
    val clip = phrase.clip(language)
    finishClip()
    session.setMetadata(MediaMetadata.Builder().putString(MediaMetadata.METADATA_KEY_TITLE, clip.text).build())
    active.update(playbackState(active, phrase, language, direction, reset))
    if (!beginPlayback()) return
    val intro = cue ?: if (completed) "sounds/lesson-complete.wav" else null
    if (intro != null) playAsset(intro) { playClip(clip) }
    else playClip(clip)
  }

  @Suppress("DEPRECATION")
  private fun beginPlayback(): Boolean {
    hasFocus = (if (Build.VERSION.SDK_INT >= 26) audioManager.requestAudioFocus(focusRequest)
      else audioManager.requestAudioFocus(focusListener, AudioManager.STREAM_MUSIC, AudioManager.AUDIOFOCUS_GAIN)) ==
      AudioManager.AUDIOFOCUS_REQUEST_GRANTED
    if (hasFocus) setPlaybackState(PlaybackState.STATE_PLAYING)
    return hasFocus
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
    clearMediaHolds()
    finishClip()
    speech?.shutdown()
    speech = null
    session.isActive = false
    session.release()
    MediaKeys.resume()
    lesson?.let { it.update(JSONObject().put("id", it.id).put("closed", true)) }
    super.onDestroy()
  }
}
