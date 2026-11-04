export type GamepadAction =
  | 'ArrowUp'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'replay'
  | 'restart'
  | 'previousLesson'
  | 'nextLesson';

const getAction = (gamepad: Gamepad): GamepadAction | null => {
  const pressed = (index: number) => gamepad.buttons[index]?.pressed;
  if (pressed(9)) return 'restart';
  if (pressed(4) && !pressed(5)) return 'previousLesson';
  if (pressed(5) && !pressed(4)) return 'nextLesson';
  if (pressed(0)) return 'replay';

  const x = Number(!!pressed(15)) - Number(!!pressed(14));
  const y = Number(!!pressed(13)) - Number(!!pressed(12));
  if (x) return x > 0 ? 'ArrowRight' : 'ArrowLeft';
  if (y) return y > 0 ? 'ArrowDown' : 'ArrowUp';

  const [stickX = 0, stickY = 0] = gamepad.axes;
  if (Math.max(Math.abs(stickX), Math.abs(stickY)) < 0.5) return null;
  if (Math.abs(stickX) > Math.abs(stickY)) return stickX > 0 ? 'ArrowRight' : 'ArrowLeft';
  return stickY > 0 ? 'ArrowDown' : 'ArrowUp';
};

// Keep this reader alive across lesson changes so a held bumper switches only one lesson.
export const createGamepadReader = () => {
  let device: string | null = null;
  let previous: GamepadAction | null = null;
  let previousButtons = new Set<number>();
  let repeatAt = 0;
  let waitingForRelease = false;

  return (gamepads: (Gamepad | null)[], now: number, enabled = true): GamepadAction | null => {
    if (!enabled) waitingForRelease = true;
    const gamepad = gamepads.find((pad) => pad?.connected && pad.mapping === 'standard');
    const nextDevice = gamepad ? `${gamepad.index}:${gamepad.id}` : null;
    if (device !== nextDevice) {
      device = nextDevice;
      previous = null;
      previousButtons = new Set();
    }
    const action = gamepad ? getAction(gamepad) : null;
    const button =
      action === 'restart'
        ? 9
        : action === 'replay'
          ? 0
          : action === 'previousLesson'
            ? 4
            : action === 'nextLesson'
              ? 5
              : null;
    const alreadyPressed = button !== null && previousButtons.has(button);
    previousButtons = new Set([0, 4, 5, 9].filter((index) => gamepad?.buttons[index]?.pressed));
    if (!enabled || waitingForRelease) {
      previous = null;
      if (enabled && !action) waitingForRelease = false;
      return null;
    }
    if (action !== previous) {
      previous = action;
      repeatAt = now + 400;
      return alreadyPressed ? null : action;
    }
    if (action?.startsWith('Arrow') && now >= repeatAt) {
      repeatAt = now + 150;
      return action;
    }
    return null;
  };
};
