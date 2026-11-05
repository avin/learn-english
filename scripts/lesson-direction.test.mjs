import React from 'react';
import * as hiIcons from 'react-icons/hi';
import * as tbIcons from 'react-icons/tb';
import TestRenderer from 'react-test-renderer';
import reactUse from 'react-use';
import cn from 'clsx';
import { shuffle } from 'lodash-es';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test, { afterEach } from 'node:test';
import ts from 'typescript';
import { mockClock } from './helpers/clock.mjs';

const { act, create } = TestRenderer;
const { usePrevious } = reactUse;
const loadModule = async (path, dependencies = {}) => {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source.replaceAll('import.meta.env.BASE_URL', "'/'"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.React,
      esModuleInterop: true,
    },
  });
  const module = { exports: {} };
  new Function('require', 'module', 'exports', outputText)(
    (name) => {
      assert.ok(name in dependencies, `Unexpected dependency: ${name}`);
      return dependencies[name];
    },
    module,
    module.exports,
  );
  return module.exports;
};

const played = [];
const created = [];
globalThis.Audio = class extends EventTarget {
  constructor(url) {
    super();
    this.url = this.src = url;
    this.paused = false;
    created.push(this);
  }
  play() {
    played.push(this);
    return Promise.resolve();
  }
  pause() {
    this.paused = true;
  }
  removeAttribute(name) {
    if (name === 'src') this.src = '';
  }
  load() {}
};
Object.defineProperty(globalThis, 'navigator', {
  configurable: true,
  value: { connection: { saveData: false } },
});
const documentListeners = new Map();
globalThis.document = {
  addEventListener(name, listener) {
    if (!documentListeners.has(name)) documentListeners.set(name, new Set());
    documentListeners.get(name).add(listener);
  },
  removeEventListener(name, listener) {
    documentListeners.get(name)?.delete(listener);
  },
  querySelector: () => null,
};
const taskResponse = () => ({
  ok: true,
  json: async () => [
    { id: 1, ru: { text: 'Привет', audio: true }, en: { text: 'Hello', audio: true } },
    { id: 2, ru: { text: 'Пока', audio: true }, en: { text: 'Bye', audio: true } },
  ],
});
const withoutDictionary = async (url) =>
  url.endsWith('/words.json') ? { ok: false, status: 404 } : taskResponse();
globalThis.fetch = withoutDictionary;
const withDictionary = async (url) =>
  url.endsWith('/words.json')
    ? {
        ok: true,
        json: async () => [
          {
            id: 1,
            ru: { text: 'кот', audio: true },
            en: { text: 'cat', audio: true, transcription: 'kæt' },
          },
          { id: 2, ru: { text: 'собака', audio: true }, en: { text: 'dog', audio: true } },
        ],
      }
    : taskResponse();
const storage = {
  loadFavoriteTranslations: async () => [],
  loadLastOpenSentences: async () => [],
  saveFavoriteTranslations: async () => {},
  saveLastOpenSentences: async () => {},
};
const Button = await loadModule('../src/components/common/Button/Button.tsx', {
  react: React,
  clsx: cn,
});
const navigation = await loadModule('../src/components/pages/MainPage/Lesson/navigation.ts');
const audioCache = await loadModule('../src/components/pages/MainPage/Lesson/audioCache.ts');
const audioPrediction = await loadModule(
  '../src/components/pages/MainPage/Lesson/audioPrediction.ts',
);
const { default: Lesson } = await loadModule('../src/components/pages/MainPage/Lesson/Lesson.tsx', {
  react: React,
  'react-icons/hi': hiIcons,
  'react-icons/tb': tbIcons,
  'react-use': { usePrevious },
  clsx: cn,
  'lodash-es': { shuffle },
  '@/components/common/Button/Button.tsx': Button,
  '@/components/common/FullPageSpinner/FullPageSpinner.tsx': () => null,
  '@/utils/ProgressContext.ts': { useProgressStorage: () => storage },
  './navigation.ts': navigation,
  './audioCache.ts': audioCache,
  './audioPrediction.ts': audioPrediction,
});
let renderer;
let controls;
afterEach(() => {
  act(() => renderer?.unmount());
  played.length = 0;
  created.length = 0;
  navigator.connection.saveData = false;
  document.hidden = false;
  globalThis.fetch = withoutDictionary;
});

const renderLesson = async (sourceLanguage = 'ru', resetOnLessonEnd = false) => {
  controls = React.createRef();
  const Session = () => {
    const [language, setLanguage] = React.useState(sourceLanguage);
    return React.createElement(Lesson, {
      ref: controls,
      course: 'titan',
      lesson: '1',
      settings: { sourceLanguage: language, autoPlayOnReveal: true, resetOnLessonEnd },
      onSwapDirection: () => setLanguage((value) => (value === 'ru' ? 'en' : 'ru')),
    });
  };
  await act(async () => {
    renderer = create(React.createElement(Session));
  });
};
const button = (label, index = 0) =>
  renderer.root.findAllByType('button').filter((item) => item.children.includes(label))[index];
const reveals = () => renderer.root.findAllByProps({ 'aria-label': 'Открыть перевод' });
const sentences = () => renderer.root.findAll((item) => item.props['data-sentence']);
const clickCell = (idx, detail = 1) => sentences()[idx].parent.props.onClick({ detail });
const dictionary = () => renderer.root.findAllByProps({ 'aria-controls': 'lesson-dictionary' });

test('a lesson without tasks loads its dictionary collapsed', async () => {
  globalThis.fetch = async (url) =>
    url.endsWith('/tasks.json') ? { ok: false, status: 404 } : withDictionary(url);
  await renderLesson();
  assert.equal(renderer.root.findAllByProps({ role: 'alert' }).length, 0);
  assert.equal(dictionary()[0].props['aria-expanded'], false);
  assert.equal(sentences().length, 0);
  act(() => dictionary()[0].props.onClick());
  assert.equal(sentences()[0].findByType('span').children.join(''), 'кот');
});

test('both toolbars have icons; swapping exchanges languages, closes answers and stops audio', async () => {
  await renderLesson();
  assert.equal(dictionary().length, 0);
  for (const label of ['Поменять', 'Перемешать', 'Открыть все', 'Закрыть все']) {
    for (const index of [0, 1]) assert.equal(button(label, index).findAllByType('svg').length, 1);
  }
  assert.deepEqual(
    sentences().map((item) => item.props.lang),
    ['ru', 'en', 'ru', 'en'],
  );
  await act(async () => reveals()[0].props.onClick());
  const audio = played.at(-1);
  assert.match(audio.url, /tasks_001_en\.m4a$/);
  assert.equal(reveals()[0].props['aria-hidden'], true);

  act(() => button('Поменять').props.onClick());
  assert.equal(audio.paused, true);
  assert.deepEqual(
    sentences().map((item) => item.props.lang),
    ['en', 'ru', 'en', 'ru'],
  );
  assert.equal(sentences()[0].findByType('span').children.join(''), 'Hello');
  assert.equal(sentences()[1].findByType('span').children.join(''), 'Привет');
  assert.ok(reveals().every((item) => item.props['aria-hidden'] === false));
  await act(async () => reveals()[0].props.onClick());
  assert.match(played.at(-1).url, /tasks_001_ru\.m4a$/);

  act(() => button('Открыть все').props.onClick());
  assert.ok(reveals().every((item) => item.props['aria-hidden'] === true));
  act(() => button('Закрыть все', 1).props.onClick());
  assert.ok(reveals().every((item) => item.props['aria-hidden'] === false));
  act(() => button('Поменять', 1).props.onClick());
  assert.equal(sentences()[0].props.lang, 'ru');
});

test('English-first controls reveal and replay Russian, then restart with English and hide answers', async () => {
  await renderLesson('en', true);
  await act(async () => controls.current.navigate('ArrowRight'));
  assert.match(played.at(-1).url, /tasks_001_en\.m4a$/);
  assert.equal(reveals()[0].props['aria-hidden'], false);
  await act(async () => controls.current.navigate('ArrowRight'));
  assert.match(played.at(-1).url, /tasks_001_ru\.m4a$/);
  assert.equal(reveals()[0].props['aria-hidden'], true);
  await act(async () => controls.current.replay());
  assert.match(played.at(-1).url, /tasks_001_ru\.m4a$/);
  await act(async () => controls.current.navigate('ArrowRight'));
  await act(async () => controls.current.navigate('ArrowRight'));
  await act(async () => controls.current.navigate('ArrowRight'));
  assert.match(played.at(-1).url, /lesson-complete\.wav$/);
  assert.ok(reveals().every((item) => item.props['aria-hidden'] === false));
  await act(async () => played.at(-1).onended());
  assert.match(played.at(-1).url, /_en\.m4a$/);
});

test('vertical navigation preloads one language and plays the same cached element from its beginning', async (t) => {
  const tick = mockClock(t);
  await renderLesson();
  tick();
  assert.equal(created.length, 0);
  await act(async () => controls.current.navigate('ArrowDown'));
  tick();
  assert.equal(created.length, 2);
  assert.ok(created.every((audio) => audio.url.endsWith('_ru.m4a')));
  const next = created.find((audio) => audio.url.endsWith('tasks_002_ru.m4a'));
  await act(async () => controls.current.navigate('ArrowDown'));
  assert.equal(played.at(-1), next);
  next.currentTime = 1.5;
  await act(async () => controls.current.replay());
  assert.equal(played.at(-1), next);
  assert.equal(next.currentTime, 0);
  assert.equal(created.length, 2);
});

test('horizontal navigation warms both languages immediately; changing columns cancels old requests', async (t) => {
  const tick = mockClock(t);
  await renderLesson();
  await act(async () => controls.current.navigate('ArrowRight'));
  tick();
  const answer = created.find((audio) => audio.url.endsWith('tasks_001_en.m4a'));
  assert.ok(answer);
  await act(async () => controls.current.navigate('ArrowRight'));
  assert.equal(played.at(-1), answer);
  act(() => button('Поменять').props.onClick());
  assert.equal(answer.paused, true);
  assert.ok(created.every((audio) => audio.src === ''));
  const count = created.length;
  tick(20_000);
  assert.equal(created.length, count);
  await act(async () => controls.current.navigate('ArrowDown'));
  tick();
  assert.ok(created.slice(count).every((audio) => audio.url.endsWith('_en.m4a')));
});

test('pointer selection learns the language pattern, including revealing a translation', async (t) => {
  const tick = mockClock(t);
  await renderLesson();
  await act(async () => {
    sentences()[0].findByType('button').props.onClick();
    clickCell(0);
  });
  tick();
  assert.ok(created.every((audio) => audio.url.endsWith('_ru.m4a')));
  await act(async () => {
    reveals()[0].props.onClick();
    clickCell(1);
  });
  tick();
  assert.ok(created.some((audio) => audio.url.endsWith('tasks_002_en.m4a')));
});

test('the collapsed dictionary shares the toolbars, audio and favorites', async (t) => {
  globalThis.fetch = withDictionary;
  const saveFavorite = t.mock.method(storage, 'saveFavoriteTranslations', async () => {});
  const saveOpen = t.mock.method(storage, 'saveLastOpenSentences', async () => {});
  await renderLesson();
  assert.match(
    dictionary()[0]
      .children.filter((child) => typeof child === 'string')
      .join(''),
    /Словарь \(2\)/,
  );
  assert.equal(dictionary()[0].props['aria-expanded'], false);
  assert.equal(sentences().length, 4);

  act(() => button('Открыть все').props.onClick());
  assert.equal(dictionary()[0].props['aria-expanded'], false);
  assert.deepEqual(saveOpen.mock.calls.at(-1).arguments, ['titan', '1', [0, 1]]);
  act(() => dictionary()[0].props.onClick());
  assert.equal(sentences()[0].findByType('span').children.join(''), 'кот');
  assert.equal(sentences()[1].findByType('span').children.join(''), 'cat');
  assert.ok(reveals().every((item) => item.props['aria-hidden']));

  act(() =>
    renderer.root
      .findAllByProps({ 'aria-label': 'Добавить в избранное' })[0]
      .props.onClick({ detail: 1 }),
  );
  const [favorites] = saveFavorite.mock.calls.at(-1).arguments;
  assert.deepEqual(favorites, [
    {
      ru: 'кот',
      en: 'cat',
      audio: {
        ru: 'translations/titan/1/audio/words_001_ru.m4a',
        en: 'translations/titan/1/audio/words_001_en.m4a',
      },
    },
  ]);
  act(() => dictionary()[0].props.onClick());
  act(() => button('Закрыть все').props.onClick());
  act(() => dictionary()[0].props.onClick());
  assert.ok(reveals().every((item) => !item.props['aria-hidden']));
  await act(async () => reveals()[0].props.onClick());
  assert.match(played.at(-1).url, /words_001_en\.m4a$/);

  act(() => dictionary()[0].props.onClick());
  act(() => button('Поменять').props.onClick());
  act(() => dictionary()[0].props.onClick());
  assert.equal(sentences()[0].props.lang, 'en');
  assert.equal(reveals()[0].props['aria-hidden'], false);
});

test('dictionary arrows wrap, V only enters, and Select or a pointer can return to sentences', async (t) => {
  globalThis.fetch = withDictionary;
  globalThis.HTMLElement = class {};
  t.after(() => delete globalThis.HTMLElement);
  await renderLesson('ru', true);
  const keyV = () => {
    for (const listener of documentListeners.get('keydown')) {
      listener({ key: 'м', code: 'KeyV', preventDefault() {} });
    }
  };
  await act(async () => keyV());
  assert.equal(dictionary()[0].props['aria-expanded'], true);
  assert.match(played.at(-1).url, /words_001_ru\.m4a$/);
  await act(async () => keyV());
  assert.equal(dictionary()[0].props['aria-expanded'], true);
  await act(async () => controls.current.navigate('ArrowUp'));
  assert.match(played.at(-1).url, /words_002_ru\.m4a$/);
  await act(async () => controls.current.navigate('ArrowRight'));
  assert.match(played.at(-1).url, /words_002_en\.m4a$/);
  await act(async () => controls.current.navigate('ArrowRight'));
  assert.match(played.at(-1).url, /words_001_ru\.m4a$/);
  await act(async () => controls.current.toggleDictionary());
  assert.equal(dictionary()[0].props['aria-expanded'], false);
  assert.match(played.at(-1).url, /tasks_001_ru\.m4a$/);
  await act(async () => controls.current.toggleDictionary());
  assert.equal(dictionary()[0].props['aria-expanded'], true);
  act(() => clickCell(4, 0));
  await act(async () => controls.current.replay());
  assert.match(played.at(-1).url, /words_001_ru\.m4a$/);
  act(() => clickCell(4));
  await act(async () => controls.current.navigate('ArrowRight'));
  assert.match(played.at(-1).url, /tasks_001_en\.m4a$/);
});

test('shuffling cancels the old lookahead and waits for a new selection', async (t) => {
  const tick = mockClock(t);
  await renderLesson();
  await act(async () => controls.current.navigate('ArrowRight'));
  tick();
  act(() => button('Перемешать').props.onClick());
  assert.equal(played[0].src.endsWith('tasks_001_ru.m4a'), true);
  assert.ok(created.slice(1).every((audio) => audio.src === ''));
  const count = created.length;
  tick(20_000);
  assert.equal(created.length, count);
});

test('data saver and background tabs suspend speculative loading while explicit playback still works', async (t) => {
  const tick = mockClock(t);
  navigator.connection.saveData = true;
  await renderLesson();
  await act(async () => controls.current.navigate('ArrowRight'));
  tick();
  assert.equal(created.length, 1);
  assert.equal(played.length, 1);
  navigator.connection.saveData = false;
  document.hidden = true;
  for (const listener of documentListeners.get('visibilitychange')) listener();
  tick();
  assert.equal(created.length, 1);
  document.hidden = false;
  for (const listener of documentListeners.get('visibilitychange')) listener();
  tick();
  assert.equal(created.length, 3);
  document.hidden = true;
  for (const listener of documentListeners.get('visibilitychange')) listener();
  assert.ok(created.slice(1).every((audio) => audio.src === ''));
  assert.notEqual(played[0].src, '');
});
