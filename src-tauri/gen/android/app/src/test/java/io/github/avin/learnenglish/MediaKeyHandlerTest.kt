package io.github.avin.learnenglish

import android.os.Looper
import android.os.SystemClock
import android.view.KeyEvent
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.Shadows.shadowOf
import org.robolectric.annotation.Config
import org.robolectric.annotation.LooperMode
import java.time.Duration

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [28])
@LooperMode(LooperMode.Mode.PAUSED)
class MediaKeyHandlerTest {
  private val actions = mutableListOf<Pair<String, Boolean>>()
  private lateinit var handler: MediaKeyHandler

  @Before
  fun setUp() {
    handler = MediaKeyHandler { key, held -> actions.add(key to held) }
    advance(10_000)
  }

  @After
  fun tearDown() {
    handler.cancel()
  }

  @Test
  fun zeroTimestampTapExecutesOnlyTheShortAction() {
    assertTrue(handler.handle(KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_NEXT)))
    advance(0)
    assertTrue(handler.handle(KeyEvent(KeyEvent.ACTION_UP, KeyEvent.KEYCODE_MEDIA_NEXT)))
    advance(5_000)
    assertEquals(listOf("next" to false), actions)
  }

  @Test
  fun rapidBounceAfterReleaseDoesNotExecuteOrArmAHold() {
    for (key in listOf(
      KeyEvent.KEYCODE_MEDIA_NEXT, KeyEvent.KEYCODE_MEDIA_PREVIOUS,
      KeyEvent.KEYCODE_MEDIA_PLAY, KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE,
      KeyEvent.KEYCODE_HEADSETHOOK, KeyEvent.KEYCODE_MEDIA_PAUSE,
    )) {
      actions.clear()
      handler.handle(KeyEvent(KeyEvent.ACTION_DOWN, key))
      handler.handle(KeyEvent(KeyEvent.ACTION_UP, key))
      advance(50)
      handler.handle(KeyEvent(KeyEvent.ACTION_DOWN, key))
      advance(2_000)
      assertEquals("A rejected bounce must not leave a hold timer", 1, actions.size)
      assertFalse(actions.single().second)
      handler.handle(KeyEvent(KeyEvent.ACTION_UP, key))
    }
  }

  @Test
  fun rejectedBouncesDoNotExtendTheWindowAndNextPressWorksAtTheThreshold() {
    handler.handle(event(KeyEvent.ACTION_DOWN))
    handler.handle(event(KeyEvent.ACTION_UP))
    advance(40)
    handler.handle(event(KeyEvent.ACTION_DOWN))
    handler.handle(event(KeyEvent.ACTION_UP))
    advance(59)
    handler.handle(event(KeyEvent.ACTION_DOWN))
    handler.handle(event(KeyEvent.ACTION_UP))
    assertEquals(listOf("next" to false), actions)
    advance(1)
    handler.handle(event(KeyEvent.ACTION_DOWN))
    handler.handle(event(KeyEvent.ACTION_UP))
    advance(2_000)
    assertEquals(listOf("next" to false, "next" to false), actions)
  }

  @Test
  fun duplicateDownDoesNotResetTheOriginalHoldDeadline() {
    handler.handle(event(KeyEvent.ACTION_DOWN, time = SystemClock.uptimeMillis()))
    advance(50)
    handler.handle(event(KeyEvent.ACTION_DOWN, time = SystemClock.uptimeMillis()))
    advance(1_450)
    assertEquals(listOf("next" to false), actions)
    advance(1)
    assertEquals(listOf("next" to false, "next" to true), actions)
    handler.handle(event(KeyEvent.ACTION_UP))
    advance(2_000)
    assertEquals(2, actions.size)
  }

  @Test
  fun transportBouncesAreSuppressedIndependentlyForEachKey() {
    for (key in listOf("next", "previous", "play", "pause")) {
      actions.clear()
      handler.tap(key)
      advance(99)
      handler.tap(key)
      assertEquals(listOf(key to false), actions)
      advance(1)
      handler.tap(key)
      advance(2_000)
      assertEquals(listOf(key to false, key to false), actions)
    }
  }

  @Test
  fun positiveTimestampPressRecoversAfterMissingRelease() {
    val first = SystemClock.uptimeMillis()
    handler.handle(event(KeyEvent.ACTION_DOWN, time = first))
    advance(2_000)
    actions.clear()
    val second = SystemClock.uptimeMillis()
    handler.handle(event(KeyEvent.ACTION_DOWN, time = second))
    advance(100)
    handler.handle(event(KeyEvent.ACTION_UP, time = second))
    advance(2_000)
    assertEquals(listOf("next" to false), actions)
  }

  @Test
  fun bluetoothPressRecoversAfterMissingRelease() {
    handler.handle(KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_NEXT))
    advance(2_000)
    actions.clear()
    handler.handle(KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_NEXT))
    advance(100)
    handler.handle(KeyEvent(KeyEvent.ACTION_UP, KeyEvent.KEYCODE_MEDIA_NEXT))
    advance(2_000)
    assertEquals(listOf("next" to false), actions)
  }

  @Test
  fun freshDownCancelsThePreviousDeadlineAndStartsANewPress() {
    handler.handle(event(KeyEvent.ACTION_DOWN))
    advance(1_400)
    handler.handle(event(KeyEvent.ACTION_DOWN))
    advance(101)
    assertEquals(listOf("next" to false, "next" to false), actions)
    advance(1_400)
    assertEquals(listOf("next" to false, "next" to false, "next" to true), actions)
  }

  @Test
  fun holdFiresAtTheThresholdOnceAndStandardRepeatsAreIgnored() {
    val time = SystemClock.uptimeMillis()
    handler.handle(event(KeyEvent.ACTION_DOWN, time = time))
    advance(500)
    handler.handle(event(KeyEvent.ACTION_DOWN, time = time, repeat = 1))
    advance(1_000)
    assertEquals(listOf("next" to false), actions)
    advance(1)
    assertEquals(listOf("next" to false, "next" to true), actions)
    handler.handle(event(KeyEvent.ACTION_DOWN, time = time, repeat = 2))
    advance(5_000)
    assertEquals(listOf("next" to false, "next" to true), actions)
    handler.handle(event(KeyEvent.ACTION_UP, time = time))
    advance(2_000)
    assertEquals(2, actions.size)
  }

  @Test
  fun orphanRepeatsAndReleasesCannotStartActions() {
    handler.handle(event(KeyEvent.ACTION_DOWN, repeat = 1))
    handler.handle(event(KeyEvent.ACTION_UP))
    advance(2_000)
    assertTrue(actions.isEmpty())
  }

  @Test
  fun canceledDownDoesNotStartAnActionAndCanceledUpStopsAHold() {
    handler.handle(event(KeyEvent.ACTION_DOWN, flags = KeyEvent.FLAG_CANCELED))
    advance(2_000)
    assertTrue(actions.isEmpty())
    handler.handle(event(KeyEvent.ACTION_DOWN))
    handler.handle(event(KeyEvent.ACTION_UP, flags = KeyEvent.FLAG_CANCELED))
    advance(2_000)
    assertEquals(listOf("next" to false), actions)
  }

  @Test
  fun transportTapCancelsTheOldTimerForThatKey() {
    handler.handle(event(KeyEvent.ACTION_DOWN))
    advance(500)
    handler.tap("next")
    advance(2_000)
    assertEquals(listOf("next" to false, "next" to false), actions)
  }

  @Test
  fun transportTapNeverStartsAHold() {
    for (key in listOf("next", "previous", "play", "pause")) handler.tap(key)
    advance(5_000)
    assertEquals(listOf("next", "previous", "play", "pause").map { it to false }, actions)
  }

  @Test
  fun devicesHoldingTheSameKeyHaveIndependentReleases() {
    handler.handle(event(KeyEvent.ACTION_DOWN, device = 1))
    handler.handle(event(KeyEvent.ACTION_DOWN, device = 2))
    handler.handle(event(KeyEvent.ACTION_UP, device = 1))
    advance(1_501)
    assertEquals(listOf("next" to false, "next" to false, "next" to true), actions)
  }

  @Test
  fun separateKeysHaveIndependentReleases() {
    handler.handle(event(KeyEvent.ACTION_DOWN))
    handler.handle(event(KeyEvent.ACTION_DOWN, key = KeyEvent.KEYCODE_MEDIA_PREVIOUS))
    handler.handle(event(KeyEvent.ACTION_UP))
    advance(1_501)
    assertEquals(listOf("next" to false, "previous" to false, "previous" to true), actions)
  }

  @Test
  fun rawPlayKeysWithTheSameSemanticActionHaveIndependentReleases() {
    handler.handle(event(KeyEvent.ACTION_DOWN, key = KeyEvent.KEYCODE_MEDIA_PLAY))
    handler.handle(event(KeyEvent.ACTION_DOWN, key = KeyEvent.KEYCODE_HEADSETHOOK))
    handler.handle(event(KeyEvent.ACTION_UP, key = KeyEvent.KEYCODE_MEDIA_PLAY))
    advance(1_501)
    assertEquals(listOf("play" to false, "play" to false, "play" to true), actions)
  }

  @Test
  fun lateReleaseOfAnOlderPressDoesNotCancelTheCurrentPress() {
    val first = SystemClock.uptimeMillis()
    handler.handle(event(KeyEvent.ACTION_DOWN, time = first))
    advance(100)
    val second = SystemClock.uptimeMillis()
    handler.handle(event(KeyEvent.ACTION_DOWN, time = second))
    handler.handle(event(KeyEvent.ACTION_UP, time = first))
    handler.handle(event(KeyEvent.ACTION_UP, time = first, flags = KeyEvent.FLAG_CANCELED))
    advance(1_501)
    assertEquals(listOf("next" to false, "next" to false, "next" to true), actions)
    handler.handle(event(KeyEvent.ACTION_UP, time = second))
  }

  @Test
  fun newerReleaseCancelsAnOldPressWhenItsOwnDownWasLost() {
    val first = SystemClock.uptimeMillis()
    handler.handle(event(KeyEvent.ACTION_DOWN, time = first))
    advance(100)
    handler.handle(event(KeyEvent.ACTION_UP, time = SystemClock.uptimeMillis()))
    advance(2_000)
    assertEquals(listOf("next" to false), actions)
  }

  @Test
  fun reentrantReleaseFromTheShortCallbackCancelsTheAlreadyRegisteredPress() {
    handler = MediaKeyHandler { key, held ->
      actions.add(key to held)
      if (!held) handler.handle(event(KeyEvent.ACTION_UP))
    }
    handler.handle(event(KeyEvent.ACTION_DOWN))
    advance(2_000)
    assertEquals(listOf("next" to false), actions)
  }

  @Test
  fun reentrantCancelFromTheShortCallbackDoesNotLeaveATimer() {
    handler = MediaKeyHandler { key, held ->
      actions.add(key to held)
      handler.cancel()
    }
    handler.handle(event(KeyEvent.ACTION_DOWN))
    advance(2_000)
    assertEquals(listOf("next" to false), actions)
  }

  @Test
  fun cancelDiscardsOldPressesAndAllowsANewContextToReceiveInput() {
    handler.handle(event(KeyEvent.ACTION_DOWN))
    advance(500)
    handler.cancel()
    actions.clear()
    advance(2_000)
    assertTrue(actions.isEmpty())
    handler.handle(event(KeyEvent.ACTION_UP))
    handler.handle(event(KeyEvent.ACTION_DOWN))
    handler.handle(event(KeyEvent.ACTION_UP))
    advance(2_000)
    assertEquals(listOf("next" to false), actions)
  }

  @Test
  fun unrelatedKeysAreNotConsumed() {
    assertFalse(handler.handle(event(KeyEvent.ACTION_DOWN, key = KeyEvent.KEYCODE_DPAD_RIGHT)))
    advance(2_000)
    assertTrue(actions.isEmpty())
  }

  private fun event(
    action: Int,
    key: Int = KeyEvent.KEYCODE_MEDIA_NEXT,
    time: Long = 0,
    repeat: Int = 0,
    device: Int = 1,
    flags: Int = 0,
  ) = KeyEvent(time, SystemClock.uptimeMillis(), action, key, repeat, 0, device, 0, flags)

  private fun advance(milliseconds: Long) {
    shadowOf(Looper.getMainLooper()).idleFor(Duration.ofMillis(milliseconds))
  }
}
