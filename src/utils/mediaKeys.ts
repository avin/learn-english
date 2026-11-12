import type { GamepadAction } from './gamepad.ts';

export const MEDIA_HOLD_MS = 1501;

export type MediaKey = 'next' | 'previous' | 'play' | 'pause';

const shortAction: Record<MediaKey, GamepadAction> = {
  next: 'ArrowRight',
  previous: 'ArrowLeft',
  play: 'replay',
  pause: 'replay',
};

const holdAction: Partial<Record<MediaKey, GamepadAction>> = {
  next: 'nextLesson',
  previous: 'previousLesson',
  play: 'restart',
};

export const isMediaKey = (key: string): key is MediaKey => key in shortAction;

export const mediaKeyFromKeyboard = (key: string): MediaKey | null => {
  switch (key) {
    case 'MediaTrackNext':
      return 'next';
    case 'MediaTrackPrevious':
      return 'previous';
    case 'MediaPlayPause':
    case 'MediaPlay':
      return 'play';
    case 'MediaPause':
      return 'pause';
    default:
      return null;
  }
};

export const mediaAction = (key: MediaKey, held: boolean): GamepadAction | null =>
  held ? holdAction[key] ?? null : shortAction[key];
