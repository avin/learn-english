package io.github.avin.learnenglish

import android.content.Intent
import android.os.Looper
import android.os.SystemClock
import android.view.KeyEvent
import org.json.JSONObject
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.Robolectric
import org.robolectric.RobolectricTestRunner
import org.robolectric.Shadows.shadowOf
import org.robolectric.annotation.Config
import org.robolectric.annotation.LooperMode
import org.robolectric.util.ReflectionHelpers
import java.time.Duration

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [28])
@LooperMode(LooperMode.Mode.PAUSED)
class TvAudioServiceMediaKeysTest {
  private lateinit var service: TvAudioService
  private val updates = mutableListOf<JSONObject>()

  @Before
  fun setUp() {
    // Robolectric resets uptime between tests, while Kotlin object state can survive.
    val handler = ReflectionHelpers.callInstanceMethod<MediaKeyHandler>(MediaKeys, "getHandler")
    ReflectionHelpers.getField<MutableMap<*, *>>(handler, "lastDown").clear()
    ReflectionHelpers.getField<MutableMap<*, *>>(handler, "lastTap").clear()
    createService()
    advance(10_000)
  }

  private fun createService() {
    service = Robolectric.buildService(TvAudioService::class.java).create().get()
    val phrase = TvAudioService.Phrase(
      0,
      TvAudioService.Clip("Первое предложение", "ru", null),
      TvAudioService.Clip("First sentence", "en", null),
    )
    val lesson = TvAudioService.Lesson(1L, "ru", listOf(phrase), 0, false, false) {
      updates.add(it)
    }
    ReflectionHelpers.setField(service, "lesson", lesson)
    ReflectionHelpers.setField(service, "phrases", lesson.phrases)
    // A boundary update is the observable result of a lesson-change command when no catalog exists.
    // Keeping the catalog absent makes this test independent of generated lesson assets.
  }

  @After
  fun tearDown() {
    service.onDestroy()
  }

  @Test
  fun bluetoothTapWithZeroTimestampsStaysInTheLesson() {
    for (key in listOf(KeyEvent.KEYCODE_MEDIA_NEXT, KeyEvent.KEYCODE_MEDIA_PREVIOUS)) {
      updates.clear()
      val down = KeyEvent(KeyEvent.ACTION_DOWN, key)
      assertEquals(0L, down.downTime)
      assertEquals(0L, down.eventTime)
      dispatch(down)
      advance(0)
      dispatch(KeyEvent(KeyEvent.ACTION_UP, key))
      advance(2_000)

      assertFalse("A Bluetooth tap must not navigate to another lesson", changedLesson())
      assertTrue("The short action must still play a sentence", updates.any { it.has("idx") })
    }
  }

  @Test
  fun delayedShortPressDoesNotBecomeAHold() {
    val oldTime = SystemClock.uptimeMillis() - 5_000
    dispatch(KeyEvent(oldTime, oldTime, KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_NEXT, 0))
    advance(0)
    dispatch(KeyEvent(oldTime, oldTime + 100, KeyEvent.ACTION_UP, KeyEvent.KEYCODE_MEDIA_NEXT, 0))
    advance(2_000)

    assertFalse("Delivery delay must not turn a tap into a lesson change", changedLesson())
  }

  @Test
  fun normalShortPressStillPlaysTheFirstRussianSentence() {
    val time = SystemClock.uptimeMillis()
    dispatch(KeyEvent(time, time, KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_NEXT, 0))
    advance(100)
    dispatch(KeyEvent(time, time + 100, KeyEvent.ACTION_UP, KeyEvent.KEYCODE_MEDIA_NEXT, 0))
    advance(2_000)

    assertFalse(changedLesson())
    assertEquals("ru", updates.first { it.has("idx") }.getString("column"))
    assertEquals(0, updates.first { it.has("idx") }.getInt("idx"))
  }

  @Test
  fun genuineHoldChangesLessonOnlyAfterTheThreshold() {
    dispatch(KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_NEXT))
    advance(1_500)
    assertFalse("The hold must not fire before 1501 ms", changedLesson())
    advance(1)
    assertTrue("A genuine hold must keep the lesson-change action", changedLesson())
    dispatch(KeyEvent(KeyEvent.ACTION_UP, KeyEvent.KEYCODE_MEDIA_NEXT))
    advance(3_000)
    assertEquals(1, updates.count { it.optBoolean("boundary") })
  }

  @Test
  fun releasingOneMediaKeyDoesNotCancelAnotherKey() {
    dispatch(KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_NEXT))
    advance(100)
    dispatch(KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_PREVIOUS))
    dispatch(KeyEvent(KeyEvent.ACTION_UP, KeyEvent.KEYCODE_MEDIA_NEXT))
    advance(1_501)
    assertEquals(1, updates.count { it.optBoolean("boundary") })
  }

  @Test
  fun standardRepeatEventsDoNotRepeatTheShortOrLongAction() {
    val time = SystemClock.uptimeMillis()
    dispatch(KeyEvent(time, time, KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_NEXT, 0))
    advance(100)
    dispatch(KeyEvent(time, time + 100, KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_NEXT, 1))
    assertEquals(1, updates.count { it.has("idx") })
    advance(1_401)
    assertEquals(1, updates.count { it.optBoolean("boundary") })

    dispatch(KeyEvent(time, time + 1_501, KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_NEXT, 2))
    advance(2_000)
    assertEquals(1, updates.count { it.has("idx") })
    assertEquals(1, updates.count { it.optBoolean("boundary") })
    dispatch(KeyEvent(KeyEvent.ACTION_UP, KeyEvent.KEYCODE_MEDIA_NEXT))
  }

  @Test
  fun freshBluetoothPressAfterMissingReleaseIsNotIgnored() {
    dispatch(KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_NEXT))
    advance(2_000)
    updates.clear()
    dispatch(KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_NEXT))
    dispatch(KeyEvent(KeyEvent.ACTION_UP, KeyEvent.KEYCODE_MEDIA_NEXT))

    assertEquals("A new Bluetooth press must work after a lost release", 1, updates.count { it.has("idx") })
  }

  @Test
  fun freshPressAfterMissingReleaseIsNotIgnored() {
    val first = SystemClock.uptimeMillis()
    dispatch(KeyEvent(first, first, KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_NEXT, 0))
    advance(2_000)
    updates.clear()
    val second = SystemClock.uptimeMillis()
    dispatch(KeyEvent(second, second, KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_NEXT, 0))
    dispatch(KeyEvent(second, second + 100, KeyEvent.ACTION_UP, KeyEvent.KEYCODE_MEDIA_NEXT, 0))

    assertEquals("A fresh press must work without restarting the service", 1, updates.count { it.has("idx") })
  }

  @Test
  fun canceledPressDoesNotPlayOrScheduleALessonChange() {
    val time = SystemClock.uptimeMillis()
    dispatch(KeyEvent(
      time, time, KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_NEXT,
      0, 0, 0, 0, KeyEvent.FLAG_CANCELED,
    ))
    advance(2_000)
    assertTrue("A canceled press must not execute either action", updates.isEmpty())
  }

  @Test
  fun releasingTheButtonAllowsTheNextPress() {
    dispatch(KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_NEXT))
    dispatch(KeyEvent(KeyEvent.ACTION_UP, KeyEvent.KEYCODE_MEDIA_NEXT))
    advance(100)
    dispatch(KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_NEXT))
    dispatch(KeyEvent(KeyEvent.ACTION_UP, KeyEvent.KEYCODE_MEDIA_NEXT))
    advance(2_000)

    val sentences = updates.filter { it.has("idx") }
    assertEquals(listOf("ru", "en"), sentences.map { it.getString("column") })
    assertFalse(changedLesson())
  }

  @Test
  fun bluetoothBounceDoesNotSkipTheFirstSentenceOrChangeLesson() {
    dispatch(KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_NEXT))
    dispatch(KeyEvent(KeyEvent.ACTION_UP, KeyEvent.KEYCODE_MEDIA_NEXT))
    advance(50)
    dispatch(KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_NEXT))
    advance(2_000)

    val sentences = updates.filter { it.has("idx") }
    assertEquals(listOf("ru"), sentences.map { it.getString("column") })
    assertFalse("A suppressed bounce must not start a hold", changedLesson())
  }

  @Test
  fun transportBounceDoesNotSkipTheFirstSentence() {
    val callback = MediaKeyCallback()
    callback.onSkipToNext()
    advance(99)
    callback.onSkipToNext()
    assertEquals(listOf("ru"), updates.filter { it.has("idx") }.map { it.getString("column") })
    advance(1)
    callback.onSkipToNext()
    assertEquals(listOf("ru", "en"), updates.filter { it.has("idx") }.map { it.getString("column") })
    advance(2_000)
    assertFalse(changedLesson())
  }

  @Test
  fun destroyingTheServiceDoesNotCarryAHoldIntoTheNextSession() {
    dispatch(KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_NEXT))
    advance(500)
    service.onDestroy()
    updates.clear()
    createService()
    advance(2_000)
    assertTrue("The next service must not inherit the previous hold", updates.isEmpty())

    dispatch(KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_NEXT))
    dispatch(KeyEvent(KeyEvent.ACTION_UP, KeyEvent.KEYCODE_MEDIA_NEXT))
    advance(2_000)
    assertEquals(1, updates.count { it.has("idx") })
    assertFalse(changedLesson())
  }

  @Test
  fun mediaSessionRawButtonCallbackUsesTheSharedRecognizer() {
    val callback = MediaKeyCallback()
    assertTrue(callback.onMediaButtonEvent(mediaIntent(KeyEvent.ACTION_DOWN)))
    advance(100)
    assertTrue(callback.onMediaButtonEvent(mediaIntent(KeyEvent.ACTION_UP)))
    advance(2_000)

    assertEquals(1, updates.count { it.has("idx") })
    assertEquals("ru", updates.first { it.has("idx") }.getString("column"))
    assertFalse(changedLesson())
  }

  @Test
  fun mediaSessionTransportCallbacksExecuteOnlyShortActions() {
    val callback = MediaKeyCallback()
    for (tap in listOf(callback::onSkipToNext, callback::onSkipToPrevious, callback::onPlay, callback::onPause)) {
      updates.clear()
      tap()
      advance(2_000)
      assertEquals("Each transport command must execute one short action", 1, updates.count { it.has("idx") })
      assertFalse("A transport command must never arm a lesson-change timer", changedLesson())
    }
  }

  @Test
  fun mediaSessionTransportTapCancelsAnEarlierRawPressTimer() {
    val callback = MediaKeyCallback()
    assertTrue(callback.onMediaButtonEvent(mediaIntent(KeyEvent.ACTION_DOWN)))
    advance(500)
    callback.onSkipToNext()
    advance(2_000)

    assertEquals(2, updates.count { it.has("idx") })
    assertFalse(changedLesson())
  }

  private fun mediaIntent(action: Int) = Intent(Intent.ACTION_MEDIA_BUTTON)
    .putExtra(Intent.EXTRA_KEY_EVENT, KeyEvent(action, KeyEvent.KEYCODE_MEDIA_NEXT))

  private fun changedLesson() = updates.any { it.optBoolean("boundary") }

  private fun dispatch(event: KeyEvent) {
    assertTrue(MediaKeys.handle(event))
  }

  private fun advance(milliseconds: Long) {
    shadowOf(Looper.getMainLooper()).idleFor(Duration.ofMillis(milliseconds))
  }
}
