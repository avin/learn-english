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
