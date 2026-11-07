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
const MobileLesson = await loadModule('../src/components/pages/MainPage/Lesson/MobileLesson.tsx', {
  react: React,
  clsx: cn,
  '@/components/common/Button/Button.tsx': Button,
});
const lodash = { shuffle };
const { default: Lesson } = await loadModule('../src/components/pages/MainPage/Lesson/Lesson.tsx', {
  react: React,
  'react-icons/hi': hiIcons,
  'react-icons/tb': tbIcons,
  'react-use': { usePrevious },
  clsx: cn,
  'lodash-es': lodash,
  '@/components/common/Button/Button.tsx': Button,
  '@/components/common/FullPageSpinner/FullPageSpinner.tsx': () => null,
  '@/utils/ProgressContext.ts': { useProgressStorage: () => storage },
  './MobileLesson.tsx': MobileLesson,
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

const renderLesson = async (sourceLanguage = 'ru', resetOnLessonEnd = false, createNodeMock) => {
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
    renderer = create(React.createElement(Session), { createNodeMock });
  });
};
const button = (label, index = 0) =>
  renderer.root.findAllByType('button').filter((item) => item.children.includes(label))[index];
const reveals = () => renderer.root.findAllByProps({ 'aria-label': 'Открыть перевод' });
const sentences = () => renderer.root.findAll((item) => item.props['data-sentence']);
const clickCell = (idx, detail = 1) => sentences()[idx].parent.props.onClick({ detail });
const dictionary = () => renderer.root.findAllByProps({ 'aria-controls': 'lesson-dictionary' });

test('mobile exit requires a continuous hold', (t) => {
  const tick = mockClock(t);
  let closed = 0;
  act(() => {
    renderer = create(
      React.createElement(MobileLesson.default, {
        dialogRef: { current: null },
        phrase: null,
        sourceLanguage: 'en',
        revealed: false,
        onArrow() {},
        onReveal() {},
        onClose() {},
      }),
      { createNodeMock: () => ({ close: () => closed++ }) },
    );
  });
  const exit = () => renderer.root.findByProps({ 'aria-label': 'Удерживайте, чтобы выйти' });
  const press = () =>
    exit().props.onPointerDown({
      isPrimary: true,
      button: 0,
      pointerId: 1,
      currentTarget: { setPointerCapture() {} },
    });
  act(() => {
    press();
    tick(250);
    exit().props.onPointerUp();
    tick(1000);
  });
  assert.equal(closed, 0);
  act(() => {
    press();
    tick(499);
  });
  assert.equal(closed, 0);
  assert.equal(
    renderer.root.findAllByProps({
      className: 'mobile-exit-progress absolute inset-0 origin-left bg-blue2/25',
    }).length,
    1,
  );
  act(() => tick(1));
  assert.equal(closed, 1);
  act(() => {
    exit().props.onKeyDown({ key: 'Enter', preventDefault() {} });
    tick(250);
    exit().props.onKeyUp({ key: 'Enter' });
    tick(500);
  });
  assert.equal(closed, 1);
  act(() => {
    exit().props.onKeyDown({ key: ' ', preventDefault() {} });
    tick(1000);
  });
  assert.equal(closed, 2);
});

test('TV mode enters fullscreen and exits it when closed', async (t) => {
  let requests = 0;
  let exits = 0;
  const topLayer = [];
  const dialog = { showModal: () => topLayer.push('dialog') };
  document.documentElement = {
    requestFullscreen: async () => {
      requests++;
      document.fullscreenElement = document.documentElement;
      topLayer.push('fullscreen');
    },
  };
  document.exitFullscreen = async () => {
    exits++;
    document.fullscreenElement = null;
  };
  t.after(() => {
    delete document.documentElement;
    delete document.fullscreenElement;
    delete document.exitFullscreen;
  });
  await renderLesson('en', false, (element) => (element.type === 'dialog' ? dialog : null));
  await act(async () => button('TV-режим').props.onClick());
  assert.equal(requests, 1);
  assert.equal(topLayer.at(-1), 'dialog', 'TV dialog must appear above the fullscreen page');
  await act(async () => renderer.root.findByType('dialog').props.onClose());
  assert.equal(exits, 1);
});

test('TV mode opens if fullscreen is rejected and leaves existing fullscreen alone', async (t) => {
  let opened = 0;
  let exits = 0;
  const dialog = { showModal: () => opened++ };
  document.documentElement = {
    requestFullscreen: async () => {
      throw new Error('denied');
    },
  };
  document.exitFullscreen = async () => exits++;
  t.after(() => {
    delete document.documentElement;
    delete document.fullscreenElement;
    delete document.exitFullscreen;
  });
  await renderLesson('en', false, (element) => (element.type === 'dialog' ? dialog : null));
  await act(async () => button('TV-режим').props.onClick());
  assert.equal(opened, 1);
  await act(async () => renderer.root.findByType('dialog').props.onClose());
  document.fullscreenElement = document.documentElement;
  await act(async () => button('TV-режим').props.onClick());
  assert.equal(opened, 2);
  await act(async () => renderer.root.findByType('dialog').props.onClose());
  assert.equal(exits, 0);
});

test('TV mode discards a swipe interrupted by rotation and follows the rotated screen', async (t) => {
  const orientation = { angle: 0 };
  globalThis.screen = { orientation };
  t.after(() => delete globalThis.screen);
  await renderLesson('en');
  await act(async () => button('TV-режим').props.onClick());

  const { onPointerDown, onPointerUp } = renderer.root.findByProps({
    'aria-describedby': 'mobile-lesson-help',
  }).props;
  const pointer = {
    pointerId: 1,
    isPrimary: true,
    button: 0,
    currentTarget: { setPointerCapture() {} },
  };
  const start = () => onPointerDown({ ...pointer, clientX: 100, clientY: 100 });
  const end = (x, y) => onPointerUp({ ...pointer, clientX: x, clientY: y });
  const count = played.length;

  await act(async () => {
    start();
    orientation.angle = 90;
    end(40, 100);
  });
  assert.equal(played.length, count);

  await act(async () => {
    start();
    end(40, 100);
  });
  assert.match(played.at(-1).url, /tasks_002_en\.m4a$/);
});

test('mobile gestures share the lesson position and progress while masking each new phrase', async (t) => {
  const saveOpen = t.mock.method(storage, 'saveLastOpenSentences', async () => {});
  await renderLesson('en');
  act(() => clickCell(2));

  const dialog = () => renderer.root.findByType('dialog');
  const surface = () => dialog().findByProps({ 'aria-describedby': 'mobile-lesson-help' });
  const source = () => surface().findAllByProps({ lang: 'en' }).at(-1).children.join('');
  const hidden = () => surface().findAllByProps({ lang: 'ru' }).at(-1).props['aria-hidden'];
  const swipe = (x, y) => {
    const pointer = {
      pointerId: 1,
      isPrimary: true,
      button: 0,
      currentTarget: { setPointerCapture() {} },
    };
    surface().props.onPointerDown({ ...pointer, clientX: 0, clientY: 0 });
    surface().props.onPointerUp({ ...pointer, clientX: x, clientY: y });
    surface().props.onClick({ detail: 1 });
  };

  act(() => button('Открыть все').props.onClick());
  await act(async () => button('TV-режим').props.onClick());
  assert.equal(source(), 'Bye');
  assert.equal(hidden(), true);
  assert.match(played.at(-1).url, /tasks_002_en\.m4a$/);

  await act(async () => swipe(0, -60));
  assert.equal(hidden(), false);
  assert.match(played.at(-1).url, /tasks_002_ru\.m4a$/);
  await act(async () => swipe(60, 0));
  assert.equal(source(), 'Hello');
  assert.equal(hidden(), true);
  assert.equal(
    surface().findAll((node) => node.props.className?.includes('mobile-phrase-reverse')).length,
    1,
  );
  const outgoing = surface().findAll((node) => node.props.className?.includes('mobile-phrase-out'));
  assert.equal(outgoing.length, 1);
  assert.equal(outgoing[0].findByProps({ lang: 'en' }).children.join(''), 'Bye');
  act(() => outgoing[0].props.onAnimationEnd());
  assert.equal(surface().findAllByProps({ lang: 'en' }).length, 1);
  await act(async () => swipe(-60, 0));
  assert.equal(source(), 'Bye');
  assert.equal(hidden(), true);
  assert.equal(
    surface().findAll((node) => node.props.className?.includes('mobile-phrase-reverse')).length,
    0,
  );
  await act(async () => surface().props.onKeyDown({ key: 'ArrowLeft', preventDefault() {} }));
  assert.equal(source(), 'Hello');
  assert.equal(
    surface().findAll((node) => node.props.className?.includes('mobile-phrase-reverse')).length,
    1,
  );
  await act(async () => surface().props.onKeyDown({ key: 'ArrowRight', preventDefault() {} }));
  assert.equal(source(), 'Bye');
  assert.equal(
    surface().findAll((node) => node.props.className?.includes('mobile-phrase-reverse')).length,
    0,
  );

  await act(async () => dialog().props.onClose());
  act(() => button('Закрыть все').props.onClick());
  await act(async () => button('TV-режим').props.onClick());
  await act(async () => swipe(0, -60));
  assert.equal(hidden(), false);
  assert.match(played.at(-1).url, /tasks_002_ru\.m4a$/);
  assert.deepEqual(saveOpen.mock.calls.at(-1).arguments, ['titan', '1', [1]]);
  const count = played.length;
  await act(async () => swipe(0, 0));
  assert.equal(played.length, count + 1);
  assert.match(played.at(-1).url, /tasks_002_ru\.m4a$/);
  await act(async () => swipe(0, -60));
  assert.equal(played.length, count + 2);
  assert.match(played.at(-1).url, /tasks_002_ru\.m4a$/);
  await act(async () => swipe(0, 60));
  assert.equal(hidden(), false);
  assert.match(played.at(-1).url, /tasks_002_en\.m4a$/);

  const shuffleOrder = t.mock.method(lodash, 'shuffle', (order) => [...order].reverse());
  const beforeRestart = played.length;
  await act(async () => swipe(-60, 0));
  assert.deepEqual(shuffleOrder.mock.calls.at(-1).arguments, [[0, 1]]);
  assert.equal(source(), 'Bye');
  assert.equal(hidden(), true);
  assert.equal(played.length, beforeRestart + 1);
  assert.match(played.at(-1).url, /lesson-complete\.wav$/);
  await act(async () => played.at(-1).onended());
  assert.match(played.at(-1).url, /tasks_002_en\.m4a$/);
  await act(async () => swipe(-60, 0));
  assert.equal(source(), 'Hello');
  assert.equal(hidden(), true);
  await act(async () => dialog().props.onClose());
  assert.match(sentences()[2].props.className, /sentence-selected/);
  assert.equal(reveals()[0].props['aria-hidden'], true);
});

test('mobile mode uses browser speech when a phrase has no recording', async (t) => {
  const spoken = [];
  globalThis.speechSynthesis = { cancel() {}, speak: (utterance) => spoken.push(utterance) };
  globalThis.SpeechSynthesisUtterance = class {
    constructor(text) {
      this.text = text;
    }
  };
  t.after(() => {
    delete globalThis.speechSynthesis;
    delete globalThis.SpeechSynthesisUtterance;
  });
  globalThis.fetch = async (url) =>
    url.endsWith('/words.json')
      ? withoutDictionary(url)
      : {
          ok: true,
          json: async () => [{ id: 1, ru: { text: 'Привет' }, en: { text: 'Hello' } }],
        };

  await renderLesson();
  await act(async () => button('TV-режим').props.onClick());
  const surface = renderer.root.findByProps({ 'aria-describedby': 'mobile-lesson-help' });
  await act(async () => surface.props.onClick({ detail: 0 }));
  await act(async () => surface.props.onKeyDown({ key: 'ArrowRight', preventDefault() {} }));
  assert.match(played.at(-1).url, /lesson-complete\.wav$/);
  assert.equal(spoken.length, 2);
  await act(async () => played.at(-1).onended());
  assert.deepEqual(
    spoken.map(({ text, lang }) => [text, lang]),
    [
      ['Привет', 'ru'],
      ['Hello', 'en'],
      ['Привет', 'ru'],
    ],
  );
});

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
