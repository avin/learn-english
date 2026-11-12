import { useEffect, useRef } from 'react';
import { isTauri } from '@tauri-apps/api/core';
import { GamepadAction } from './gamepad.ts';
import {
  MEDIA_HOLD_MS,
  MediaKey,
  isMediaKey,
  mediaAction,
  mediaKeyFromKeyboard,
} from './mediaKeys.ts';

const controlsAvailable = () => {
  const target = document.activeElement;
  const editing =
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      target.closest('input, textarea, select, [role="combobox"], [role="slider"]'));
  return !editing && !document.querySelector('dialog[open]:not([data-gamepad])');
};

export const useMediaKeys = (onAction: (action: GamepadAction) => void, suspended: boolean) => {
  const handler = useRef({ onAction, suspended });
  const timers = useRef(new Map<MediaKey, number>());

  useEffect(() => {
    handler.current = { onAction, suspended };
    if (suspended) {
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current.clear();
    }
  }, [onAction, suspended]);

  useEffect(() => {
    const down = (key: MediaKey) => {
      if (timers.current.has(key) || handler.current.suspended || !controlsAvailable()) return;
      const action = mediaAction(key, false);
      if (action) handler.current.onAction(action);
      const timer = window.setTimeout(() => {
        timers.current.delete(key);
        if (handler.current.suspended || !controlsAvailable()) return;
        const held = mediaAction(key, true);
        if (held) handler.current.onAction(held);
      }, MEDIA_HOLD_MS);
      timers.current.set(key, timer);
    };
    const up = (key: MediaKey) => {
      const timer = timers.current.get(key);
      if (timer === undefined) return;
      window.clearTimeout(timer);
      timers.current.delete(key);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const key = mediaKeyFromKeyboard(event.key);
      if (
        !key ||
        event.repeat ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.isComposing ||
        event.defaultPrevented
      )
        return;
      event.preventDefault();
      down(key);
    };
    const onKeyUp = (event: KeyboardEvent) => {
      const key = mediaKeyFromKeyboard(event.key);
      if (key) up(key);
    };
    const onAndroid = (event: Event) => {
      const detail = (event as CustomEvent<{ key?: string; phase?: string }>).detail;
      if (!detail?.key || !isMediaKey(detail.key)) return;
      if (detail.phase === 'down') down(detail.key);
      else if (detail.phase === 'up') up(detail.key);
    };

    const cancel = () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current.clear();
    };
    const onHide = () => {
      if (document.hidden) cancel();
    };
    const nativeSession = isTauri() && /Android/.test(navigator.userAgent);
    if (!nativeSession) {
      document.addEventListener('keydown', onKeyDown);
      document.addEventListener('keyup', onKeyUp);
      window.addEventListener('blur', cancel);
      document.addEventListener('visibilitychange', onHide);
    }
    window.addEventListener('android-media-key', onAndroid);
    return () => {
      cancel();
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', cancel);
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('android-media-key', onAndroid);
    };
  }, []);
};
