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
globalThis.Audio = class {
  constructor(url) {
    this.url = url;
    this.paused = false;
  }
  play() {
    played.push(this);
    return Promise.resolve();
  }
  pause() {
    this.paused = true;
  }
};
globalThis.document = {
  addEventListener() {},
  removeEventListener() {},
  querySelector: () => null,
};
globalThis.fetch = async () => ({
  ok: true,
  json: async () => [
    { id: 1, ru: { text: 'Привет', audio: true }, en: { text: 'Hello', audio: true } },
    { id: 2, ru: { text: 'Пока', audio: true }, en: { text: 'Bye', audio: true } },
  ],
});
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
});
let renderer;
let controls;
afterEach(() => {
  act(() => renderer?.unmount());
  played.length = 0;
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

test('both toolbars have icons; swapping exchanges languages, closes answers and stops audio', async () => {
  await renderLesson();
  for (const label of ['Поменять', 'Перемешать', 'Открыть все', 'Закрыть все']) {
    for (const index of [0, 1]) assert.equal(button(label, index).findAllByType('svg').length, 1);
  }
  assert.deepEqual(
    sentences().map((item) => item.props.lang),
    ['ru', 'en', 'ru', 'en'],
  );
  await act(async () => reveals()[0].props.onClick());
  const audio = played.at(-1);
  assert.match(audio.url, /001_en\.m4a$/);
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
  assert.match(played.at(-1).url, /001_ru\.m4a$/);

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
  assert.match(played.at(-1).url, /001_en\.m4a$/);
  assert.equal(reveals()[0].props['aria-hidden'], false);
  await act(async () => controls.current.navigate('ArrowRight'));
  assert.match(played.at(-1).url, /001_ru\.m4a$/);
  assert.equal(reveals()[0].props['aria-hidden'], true);
  await act(async () => controls.current.replay());
  assert.match(played.at(-1).url, /001_ru\.m4a$/);
  await act(async () => controls.current.navigate('ArrowRight'));
  await act(async () => controls.current.navigate('ArrowRight'));
  await act(async () => controls.current.navigate('ArrowRight'));
  assert.match(played.at(-1).url, /lesson-complete\.wav$/);
  assert.ok(reveals().every((item) => item.props['aria-hidden'] === false));
  await act(async () => played.at(-1).onended());
  assert.match(played.at(-1).url, /_en\.m4a$/);
});
