export interface AppSettings {
  autoPlayOnReveal: boolean;
  showAudioUnderline: boolean;
  gamepadEnabled: boolean;
  resetOnLessonEnd: boolean;
  cursorZonePercent: number;
  cursorScrollDurationMs: number;
}

export const cursorZoneOptions = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
export const cursorScrollDurationOptions = [200, 400, 600, 800, 1000, 1500];

const storageKey = 'settings';
const defaultSettings: AppSettings = {
  autoPlayOnReveal: true,
  showAudioUnderline: true,
  gamepadEnabled: true,
  resetOnLessonEnd: false,
  cursorZonePercent: 30,
  cursorScrollDurationMs: 600,
};

export const loadSettings = (): AppSettings => {
  try {
    const saved = JSON.parse(
      localStorage.getItem(storageKey) || '{}',
    ) as Partial<AppSettings> | null;
    return {
      autoPlayOnReveal:
        typeof saved?.autoPlayOnReveal === 'boolean'
          ? saved.autoPlayOnReveal
          : defaultSettings.autoPlayOnReveal,
      showAudioUnderline:
        typeof saved?.showAudioUnderline === 'boolean'
          ? saved.showAudioUnderline
          : defaultSettings.showAudioUnderline,
      gamepadEnabled:
        typeof saved?.gamepadEnabled === 'boolean'
          ? saved.gamepadEnabled
          : defaultSettings.gamepadEnabled,
      resetOnLessonEnd:
        typeof saved?.resetOnLessonEnd === 'boolean'
          ? saved.resetOnLessonEnd
          : defaultSettings.resetOnLessonEnd,
      cursorZonePercent:
        typeof saved?.cursorZonePercent === 'number' &&
        cursorZoneOptions.includes(saved.cursorZonePercent)
          ? saved.cursorZonePercent
          : defaultSettings.cursorZonePercent,
      cursorScrollDurationMs:
        typeof saved?.cursorScrollDurationMs === 'number' &&
        cursorScrollDurationOptions.includes(saved.cursorScrollDurationMs)
          ? saved.cursorScrollDurationMs
          : defaultSettings.cursorScrollDurationMs,
    };
  } catch {
    return defaultSettings;
  }
};

export const saveSettings = (settings: AppSettings) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};
