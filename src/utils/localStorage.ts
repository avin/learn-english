import { Translation } from '@/types';

const prepareKey = (key: string) => `learn_english:${key}`;

export const localStorageSetItem = (key: string, value: string): void => {
  try {
    localStorage.setItem(prepareKey(key), value);
  } catch (e) {
    console.warn(e);
  }
};

export const localStorageGetItem = (key: string) => {
  return localStorage.getItem(prepareKey(key));
};

export const localStorageRemoveItemsByPrefix = (prefix: string) => {
  const fullPrefix = prepareKey(prefix);
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith(fullPrefix)) {
      localStorage.removeItem(key);
    }
  });
};

export const loadFavoriteTranslations = (): Translation[] => {
  const content = localStorageGetItem('favoriteTranslations') || '';
  try {
    const result = JSON.parse(content);
    return result;
  } catch (e) {
    return [];
  }
};

export const saveFavoriteTranslations = (translations: Translation[]) => {
  localStorageSetItem('favoriteTranslations', JSON.stringify(translations));
};
