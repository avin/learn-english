export type Course = 'titan' | 'express' | 'favorites';
export type Translation = {
  ru: string;
  en: string;
  audio?: Partial<Record<'ru' | 'en', string>>;
};
export type TranslationPhrase = { text: string; audio: boolean };
export type TranslationTask = { id: number; ru: TranslationPhrase; en: TranslationPhrase };
