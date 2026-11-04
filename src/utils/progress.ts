import { Course, Translation } from '@/types';

export const localProgressKey = 'learn-english:progress:v1';
export const localModeKey = 'learn-english:mode';

export interface ProgressData {
  favoriteTranslations?: Translation[];
  lastCourse?: Course;
  lastLessons?: Partial<Record<Course, string>>;
  lastOpenSentences?: Partial<Record<Course, Record<string, number[]>>>;
}

export interface ProgressAdapter {
  read: () => ProgressData | Promise<ProgressData>;
  patch: (data: ProgressData) => void | Promise<void>;
}

export interface ProgressError {
  type: 'load' | 'save';
  message: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const hasLocalSession = () => {
  try {
    return localStorage.getItem(localModeKey) === 'local';
  } catch {
    return false;
  }
};

export const startLocalSession = () => {
  const probeKey = `${localModeKey}:probe`;
  localStorage.setItem(probeKey, '1');
  localStorage.removeItem(probeKey);
  localStorage.setItem(localModeKey, 'local');
};

export const clearLocalSession = () => {
  try {
    localStorage.removeItem(localModeKey);
  } catch {
    // Signing in must still work when browser storage is blocked.
  }
};

export const createLocalProgressAdapter = (): ProgressAdapter => {
  const read = (): ProgressData => {
    const saved = localStorage.getItem(localProgressKey);
    if (saved === null) return {};
    const data: unknown = JSON.parse(saved);
    if (!isRecord(data)) throw new Error('Invalid local progress');
    return data as ProgressData;
  };

  return {
    read,
    patch(data) {
      // Keep read/merge/write synchronous to preserve concurrent changes to other fields.
      const current = read();
      const merged = { ...current, ...data };
      if (data.lastLessons) {
        merged.lastLessons = { ...current.lastLessons, ...data.lastLessons };
      }
      if (data.lastOpenSentences) {
        merged.lastOpenSentences = { ...current.lastOpenSentences };
        for (const course of Object.keys(data.lastOpenSentences) as Course[]) {
          merged.lastOpenSentences[course] = {
            ...current.lastOpenSentences?.[course],
            ...data.lastOpenSentences[course],
          };
        }
      }
      localStorage.setItem(localProgressKey, JSON.stringify(merged));
    },
  };
};

export const createProgressStorage = (
  adapter: ProgressAdapter,
  onError: (error: ProgressError | null) => void,
  location: 'local' | 'cloud' = 'local',
) => {
  let loadFailed = false;
  const pending: ProgressData[] = [];
  let saving = Promise.resolve();

  const load = async <T>(select: (data: ProgressData) => T, fallback: T): Promise<T> => {
    try {
      await saving;
      return select(await adapter.read());
    } catch (error) {
      console.error('Error loading progress:', error);
      loadFailed = true;
      onError({
        type: 'load',
        message:
          'Не удалось загрузить прогресс. Обновите страницу перед продолжением занятий. Сохранение приостановлено, чтобы защитить ваши данные.',
      });
      return fallback;
    }
  };

  const flush = () => {
    saving = saving
      .then(async () => {
        if (loadFailed || !pending.length) return;
        while (pending.length) {
          await adapter.patch(pending[0]);
          pending.shift();
        }
        if (!loadFailed) onError(null);
      })
      .catch((error: unknown) => {
        console.error('Error saving progress:', error);
        if (loadFailed) return;
        onError({
          type: 'save',
          message:
            location === 'local'
              ? 'Не удалось сохранить последние изменения. Возможно, в браузере закончилось место или запрещено хранение данных. Проверьте настройки и повторите сохранение, прежде чем закрыть страницу.'
              : 'Не удалось сохранить последние изменения в аккаунте. Проверьте подключение к интернету и повторите сохранение, прежде чем закрыть страницу.',
        });
      });
    return saving;
  };

  const save = (data: ProgressData) => {
    if (loadFailed) return Promise.resolve();
    pending.push(data);
    return flush();
  };

  return {
    retrySaving: flush,
    hasUnsavedChanges: () => pending.length > 0,
    loadFavoriteTranslations: () =>
      load(
        (data) =>
          Array.isArray(data.favoriteTranslations)
            ? data.favoriteTranslations.filter(
                (item) => item && typeof item.ru === 'string' && typeof item.en === 'string',
              )
            : [],
        [],
      ),
    saveFavoriteTranslations: (translations: Translation[]) =>
      save({ favoriteTranslations: translations }),
    loadLastCourse: () =>
      load(
        (data): Course =>
          data.lastCourse && ['titan', 'express', 'favorites'].includes(data.lastCourse)
            ? data.lastCourse
            : 'titan',
        'titan',
      ),
    saveLastCourse: (course: Course) => save({ lastCourse: course }),
    loadLastLesson: (course: Course) =>
      load((data) => {
        const lesson = data.lastLessons?.[course];
        return typeof lesson === 'string' ? lesson : null;
      }, null),
    saveLastLesson: (course: Course, lesson: string) => save({ lastLessons: { [course]: lesson } }),
    loadLastOpenSentences: (course: Course, lesson: string) =>
      load((data) => {
        const sentences = data.lastOpenSentences?.[course]?.[lesson];
        return Array.isArray(sentences)
          ? sentences.filter((index) => Number.isInteger(index) && index >= 0)
          : [];
      }, []),
    saveLastOpenSentences: (course: Course, lesson: string, sentences: number[]) =>
      save({ lastOpenSentences: { [course]: { [lesson]: sentences } } }),
  };
};

export type ProgressStorage = ReturnType<typeof createProgressStorage>;
