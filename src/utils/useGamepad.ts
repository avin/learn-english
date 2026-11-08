import { useEffect, useRef } from 'react';
import { GamepadAction, createGamepadReader } from './gamepad.ts';

export const useGamepad = (
  onAction: (action: GamepadAction) => void,
  enabled: boolean,
  suspended: boolean,
) => {
  const handler = useRef({ onAction, suspended });
  useEffect(() => {
    handler.current = { onAction, suspended };
  }, [onAction, suspended]);

  useEffect(() => {
    if (!enabled || typeof navigator.getGamepads !== 'function') return;
    const read = createGamepadReader();
    let frame: number;
    const suspend = () => read([], performance.now(), false);
    const poll = (now: number) => {
      const target = document.activeElement;
      const editing =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.closest('input, textarea, select, [role="combobox"], [role="slider"]'));
      let gamepads: (Gamepad | null)[];
      try {
        gamepads = navigator.getGamepads();
      } catch {
        // A browser or an embedding page can deny access to the Gamepad API.
        return;
      }
      const action = read(
        gamepads,
        now,
        !handler.current.suspended &&
          document.visibilityState === 'visible' &&
          document.hasFocus() &&
          !document.querySelector('dialog[open]:not([data-gamepad])') &&
          !editing,
      );
      if (action) handler.current.onAction(action);
      frame = requestAnimationFrame(poll);
    };
    frame = requestAnimationFrame(poll);
    window.addEventListener('blur', suspend);
    document.addEventListener('visibilitychange', suspend);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('blur', suspend);
      document.removeEventListener('visibilitychange', suspend);
    };
  }, [enabled]);
};
