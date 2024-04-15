import { doc, getDoc, setDoc } from 'firebase/firestore/lite';
import { auth, db } from '@/firebase-config.ts';
import { Course, Translation } from '@/types';

const saveUserData = async (data: Record<string, unknown>) => {
  try {
    const userId = auth.currentUser!.uid;
    const docRef = doc(db, 'users', userId);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      await setDoc(docRef, data, { merge: true });
    } else {
      await setDoc(docRef, data);
    }
  } catch (e) {
    console.error('Error saving user data: ', e, data);
  }
};

const loadUserData = async <T extends Record<string, unknown>>(): Promise<T | null> => {
  try {
    const userId = auth.currentUser!.uid;
    const docRef = doc(db, 'users', userId);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      return docSnapshot.data() as T;
    } else {
      return null;
    }
  } catch (e) {
    console.error('Error loading user data:', e);
    return null;
  }
};

export const saveFavoriteTranslations = async (translations: Translation[]) => {
  const data = translations.map((i) => ({ ru: i[0], en: i[1] }));
  await saveUserData({ favoriteTranslations: data });
};

export const loadFavoriteTranslations = async (): Promise<Translation[]> => {
  const data = await loadUserData<{ favoriteTranslations: { ru: string; en: string }[] }>();
  if (data && data.favoriteTranslations) {
    try {
      // Предполагается, что favoriteTranslations хранится в формате JSON-строки
      const translations = data.favoriteTranslations.map((i) => [i.ru, i.en]);
      return translations as Translation[];
    } catch (e) {
      console.error('Error parsing favorite translations:', e);
      return [];
    }
  }
  return [];
};

export const loadLastCourse = async (): Promise<Course> => {
  const data = await loadUserData<{ lastCourse: Course }>();
  if (data && data.lastCourse) {
    return data.lastCourse;
  }
  return 'titan';
};

export const saveLastCourse = async (course: Course) => {
  await saveUserData({ lastCourse: course });
};

export const loadLastLesson = async (course: Course): Promise<string | null> => {
  const data = await loadUserData<{ lastLessons: Record<Course, string> }>();
  if (data && data.lastLessons) {
    return data.lastLessons[course];
  }
  return null;
};

export const saveLastLesson = async (course: Course, lesson: string) => {
  const data = await loadUserData<{ lastLessons: Record<Course, string> }>();

  const lastLessons = (data && data.lastLessons) || ({} as Record<Course, string>);

  lastLessons[course] = lesson;

  await saveUserData({ lastLessons });
};

// ----------

export const loadLastOpenSentences = async (course: Course, lesson: string): Promise<number[]> => {
  const data = await loadUserData<{
    lastOpenSentences: Record<Course, Record<string, number[]>>;
  }>();
  if (data && data.lastOpenSentences) {
    return data.lastOpenSentences[course][lesson] || [];
  }
  return [];
};

export const saveLastOpenSentences = async (
  course: Course,
  lesson: string,
  sentences: number[],
) => {
  const data = await loadUserData<{
    lastOpenSentences: Record<Course, Record<string, number[]>>;
  }>();

  const lastOpenSentences =
    (data && data.lastOpenSentences) || ({} as Record<Course, Record<string, number[]>>);

  lastOpenSentences[course] ||= {};
  lastOpenSentences[course][lesson] = sentences;

  await saveUserData({ lastOpenSentences });
};
