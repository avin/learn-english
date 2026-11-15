export const PRESS_GUARD_MS = 100;

export const createPressGuard = () => {
  const lastPress = new Map<string, number>();
  return (key: string, now = performance.now(), repeat = false) => {
    const previous = lastPress.get(key);
    if (!repeat && previous !== undefined && now - previous < PRESS_GUARD_MS) return false;
    lastPress.set(key, now);
    return true;
  };
};

export const createKeyboardPressGuard = () => {
  const acceptPress = createPressGuard();
  return (event: Pick<KeyboardEvent, 'key' | 'code' | 'shiftKey' | 'repeat'>) =>
    acceptPress(
      `${event.shiftKey ? 'Shift+' : ''}${event.code || event.key}`,
      undefined,
      event.repeat,
    );
};

export type KeyboardPressGuard = ReturnType<typeof createKeyboardPressGuard>;
