export interface AppSettings {
  autoPlayOnReveal: boolean;
  showAudioUnderline: boolean;
}

const storageKey = 'settings';
const defaultSettings: AppSettings = { autoPlayOnReveal: true, showAudioUnderline: true };

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
