package io.github.avin.learnenglish

import android.os.Handler
import android.os.Looper
import android.os.SystemClock
import android.view.KeyEvent

private const val PRESS_DEBOUNCE_MS = 100L

internal class MediaKeyHandler(private val onAction: (String, Boolean) -> Unit) {
  private data class Press(val key: String, val downTime: Long, val timer: Runnable?)

  private val main = Handler(Looper.getMainLooper())
  private val presses = mutableMapOf<Pair<Int, Int>, Press>()
  private val lastDown = mutableMapOf<Pair<Int, Int>, Long>()
  private val lastTap = mutableMapOf<String, Long>()

  fun handle(event: KeyEvent): Boolean {
    val key = when (event.keyCode) {
      KeyEvent.KEYCODE_MEDIA_NEXT -> "next"
      KeyEvent.KEYCODE_MEDIA_PREVIOUS -> "previous"
      KeyEvent.KEYCODE_MEDIA_PLAY, KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE,
      KeyEvent.KEYCODE_HEADSETHOOK -> "play"
      KeyEvent.KEYCODE_MEDIA_PAUSE -> "pause"
      else -> return false
    }
    val identity = event.deviceId to event.keyCode
    if (event.action == KeyEvent.ACTION_UP || event.isCanceled) {
      val press = presses[identity] ?: return true
      if (press.downTime > 0 && event.downTime > 0 && event.downTime < press.downTime) return true
      remove(identity)
      return true
    }
    if (event.action != KeyEvent.ACTION_DOWN || event.repeatCount != 0) return true

    val now = SystemClock.uptimeMillis()
    val previous = lastDown[identity]
    if (previous != null && now - previous < PRESS_DEBOUNCE_MS) return true
    lastDown[identity] = now

    // An accepted initial DOWN starts a new press, including after a missing UP.
    remove(identity)
    lateinit var press: Press
    val timer = if (key == "pause") null else Runnable {
      if (presses[identity] === press) onAction(key, true)
    }
    press = Press(key, event.downTime, timer)
    presses[identity] = press
    // AVRCP can supply zero timestamps. Use the same receipt-based clock for all devices.
    if (timer != null) main.postDelayed(timer, 1501L)
    onAction(key, false)
    return true
  }

  fun tap(key: String) {
    val now = SystemClock.uptimeMillis()
    val previous = lastTap[key]
    if (previous != null && now - previous < PRESS_DEBOUNCE_MS) return
    lastTap[key] = now
    presses.filterValues { it.key == key }.keys.toList().forEach(::remove)
    onAction(key, false)
  }

  fun cancel() {
    presses.keys.toList().forEach(::remove)
  }

  private fun remove(identity: Pair<Int, Int>) {
    presses.remove(identity)?.timer?.let(main::removeCallbacks)
  }
}
