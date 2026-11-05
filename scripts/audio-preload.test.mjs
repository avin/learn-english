import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';
import { mockClock } from './helpers/clock.mjs';

const loadModule = async (path) => {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
};
const { AudioPrediction } = await loadModule(
  '../src/components/pages/MainPage/Lesson/audioPrediction.ts',
);
const { AudioCache } = await loadModule('../src/components/pages/MainPage/Lesson/audioCache.ts');

const translations = Array.from({ length: 8 }, (_, idx) => ({
  ru: `ru ${idx}`,
  en: `en ${idx}`,
  audio: { ru: `${idx}_ru`, en: `${idx}_en` },
}));
const order = [0, 1, 2, 3, 4, 5, 6, 7];
const selection = (idx, column = 'ru') => ({ idx, column });
const observe = (predictor, selections, displayOrder = order) => {
  for (const selected of selections) predictor.observe(selected, displayOrder);
  return selections.at(-1);
};

test('no speculative language choice before the first interaction', () => {
  const predictor = new AudioPrediction();
  assert.deepEqual(predictor.upcoming(translations, order, null, 'ru', false), []);
  assert.deepEqual(predictor.upcoming(translations, order, selection(0), 'ru', false), []);
});

test('single-column navigation preloads only that language in visible order', () => {
  for (const column of ['ru', 'en']) {
    const predictor = new AudioPrediction();
    const shuffled = [4, 1, 7, 0, 3, 2];
    const current = selection(1, column);
    predictor.observe(current, shuffled, 'ArrowDown');
    assert.deepEqual(predictor.upcoming(translations, shuffled, current, 'ru', false), [
      `7_${column}`,
      `0_${column}`,
      `3_${column}`,
      `2_${column}`,
    ]);
  }
});

test('the first horizontal key already predicts both languages in reading order', () => {
  const predictor = new AudioPrediction();
  predictor.observe(selection(0), order, 'ArrowRight');
  assert.deepEqual(predictor.upcoming(translations, order, selection(0), 'ru', false), [
    '0_en',
    '1_ru',
    '1_en',
    '2_ru',
  ]);
  predictor.observe(selection(0, 'en'), order, 'ArrowRight', 'en');
  assert.deepEqual(predictor.upcoming(translations, order, selection(0, 'en'), 'en', false), [
    '0_ru',
    '1_en',
    '1_ru',
    '2_en',
  ]);
});

test('mouse language alternation predicts both; four distinct single-language selections adapt back', () => {
  const predictor = new AudioPrediction();
  let current = observe(predictor, [selection(0), selection(0, 'en')]);
  assert.deepEqual(predictor.upcoming(translations, order, current, 'ru', false), [
    '1_ru',
    '1_en',
    '2_ru',
    '2_en',
  ]);
  for (let repeat = 0; repeat < 10; repeat++) predictor.observe(current, order);
  assert.ok(predictor.upcoming(translations, order, current, 'ru', false).includes('1_ru'));
  current = observe(predictor, [selection(1, 'en'), selection(2, 'en'), selection(3, 'en')]);
  assert.deepEqual(predictor.upcoming(translations, order, current, 'ru', false), [
    '4_en',
    '5_en',
    '6_en',
    '7_en',
  ]);
});

test('backward keys wrap correctly and backward pointer jumps follow displayed rows', () => {
  const predictor = new AudioPrediction();
  predictor.observe(selection(0, 'en'), order, 'ArrowUp');
  assert.deepEqual(predictor.upcoming(translations, order, selection(0, 'en'), 'ru', false), [
    '7_en',
    '6_en',
    '5_en',
    '4_en',
  ]);
  predictor.observe(selection(0), order, 'ArrowLeft');
  assert.deepEqual(predictor.upcoming(translations, order, selection(0), 'ru', false), [
    '7_en',
    '7_ru',
    '6_en',
    '6_ru',
  ]);
  predictor.reset();
  const current = observe(predictor, [selection(5), selection(3)]);
  assert.deepEqual(predictor.upcoming(translations, order, current, 'ru', false), [
    '2_ru',
    '1_ru',
    '0_ru',
    '7_ru',
  ]);
});

test('missing audio and duplicate URLs are skipped without revisiting the current recording', () => {
  const predictor = new AudioPrediction();
  const items = [
    { audio: { ru: 'current' } },
    { audio: { ru: 'current' } },
    {},
    { audio: { ru: 'next' } },
    { audio: { ru: 'next' } },
    { audio: { ru: 'last' } },
  ];
  predictor.observe(selection(0), [0, 1, 2, 3, 4, 5], 'ArrowDown');
  assert.deepEqual(predictor.upcoming(items, [0, 1, 2, 3, 4, 5], selection(0), 'ru', false), [
    'next',
    'last',
  ]);
  assert.deepEqual(predictor.upcoming(items, [0], selection(0), 'ru', false), []);
  assert.deepEqual(predictor.upcoming(items, [], selection(0), 'ru', false), []);
});

test('automatic shuffled restarts are not predicted, but vertical wrapping is', () => {
  const predictor = new AudioPrediction();
  predictor.observe(selection(7), order, 'ArrowRight');
  assert.deepEqual(predictor.upcoming(translations, order, selection(7), 'ru', true), ['7_en']);
  predictor.observe(selection(7, 'en'), order, 'ArrowRight');
  assert.deepEqual(predictor.upcoming(translations, order, selection(7, 'en'), 'ru', true), []);
  predictor.reset();
  predictor.observe(selection(7), order, 'ArrowDown');
  assert.deepEqual(predictor.upcoming(translations, order, selection(7), 'ru', true), [
    '0_ru',
    '1_ru',
    '2_ru',
    '3_ru',
  ]);
});

test('reset forgets the old language pattern and removed selections produce no requests', () => {
  const predictor = new AudioPrediction();
  observe(predictor, [selection(0), selection(0, 'en')]);
  predictor.reset();
  predictor.observe(selection(2, 'en'), [2, 5, 7]);
  assert.deepEqual(predictor.upcoming(translations, [2, 5, 7], selection(2, 'en'), 'en', false), [
    '5_en',
    '7_en',
  ]);
  assert.deepEqual(predictor.upcoming(translations, [5, 7], selection(2, 'en'), 'en', false), []);
});

const created = [];
globalThis.Audio = class extends EventTarget {
  constructor(url) {
    super();
    this.url = this.src = url;
    this.released = false;
    created.push(this);
  }
  pause() {}
  removeAttribute(name) {
    if (name === 'src') this.src = '';
  }
  load() {
    this.released = !this.src;
  }
};
const makeCache = (t) => {
  created.length = 0;
  const tick = mockClock(t);
  const cache = new AudioCache();
  t.after(() => cache.clear());
  return { cache, tick };
};
const urls = () => created.map((audio) => audio.url);

test('preloading is deferred, deduplicated, bounded to four files and two concurrent requests', (t) => {
  const { cache, tick } = makeCache(t);
  cache.preload(['a', 'a', 'b', 'c', 'd', 'e']);
  assert.equal(created.length, 0);
  tick();
  assert.deepEqual(urls(), ['a', 'b']);
  created[0].dispatchEvent(new Event('canplaythrough'));
  tick();
  assert.deepEqual(urls(), ['a', 'b', 'c']);
  created[1].dispatchEvent(new Event('canplaythrough'));
  tick();
  assert.deepEqual(urls(), ['a', 'b', 'c', 'd']);
  for (const audio of created) audio.dispatchEvent(new Event('canplaythrough'));
  tick();
  assert.ok(created.every((audio) => audio.preload === 'auto'));
  assert.equal(created.length, 4);
});

test('playback reuses ready and in-flight elements, freeing a speculative slot immediately', (t) => {
  const { cache, tick } = makeCache(t);
  cache.preload(['a', 'b', 'c']);
  tick();
  const first = created[0];
  assert.equal(cache.get('a'), first);
  tick();
  assert.deepEqual(urls(), ['a', 'b', 'c']);
  first.dispatchEvent(new Event('canplaythrough'));
  assert.equal(cache.get('a'), first);
  assert.equal(created.length, 3);
  assert.equal(first.released, false);
});

test('fast navigation coalesces plans and cancels obsolete requests without interrupting playback', (t) => {
  const { cache, tick } = makeCache(t);
  const current = cache.get('current');
  cache.preload(['never-started']);
  cache.preload(['a', 'b']);
  tick();
  assert.deepEqual(urls(), ['current', 'a', 'b']);
  cache.preload(['x', 'y']);
  assert.ok(created[1].released && created[2].released);
  assert.equal(current.released, false);
  tick();
  assert.deepEqual(urls(), ['current', 'a', 'b', 'x', 'y']);
});

test('clearing aborts requests, detaches callbacks and prevents deferred work from restarting', (t) => {
  const { cache, tick } = makeCache(t);
  cache.get('current');
  cache.preload(['a', 'b']);
  tick();
  cache.clear();
  for (const audio of created) {
    assert.equal(audio.released, true);
    audio.dispatchEvent(new Event('canplaythrough'));
  }
  tick(20_000);
  assert.equal(created.length, 3);
  cache.preload(['new-lesson']);
  cache.clear();
  tick();
  assert.equal(created.length, 3);
});

test('errors and timeouts release slots without retry loops; explicit playback can retry', (t) => {
  const { cache, tick } = makeCache(t);
  cache.preload(['error', 'stalled', 'next']);
  tick();
  created[0].dispatchEvent(new Event('error'));
  tick();
  assert.deepEqual(urls(), ['error', 'stalled', 'next']);
  created[2].dispatchEvent(new Event('canplaythrough'));
  tick(10_000);
  tick();
  assert.equal(created[1].released, true);
  assert.equal(created.length, 3);
  const retry = cache.get('error');
  assert.notEqual(retry, created[0]);
  assert.equal(created[0].released, true);
  assert.equal(created.length, 4);
});

test('bounded LRU keeps recent recordings for replay and releases evicted media', (t) => {
  const { cache } = makeCache(t);
  const first = cache.get('first');
  first.dispatchEvent(new Event('canplaythrough'));
  for (let i = 0; i < 11; i++) {
    cache.get(`phrase-${i}`).dispatchEvent(new Event('canplaythrough'));
  }
  assert.equal(cache.get('first'), first);
  const newest = cache.get('newest');
  assert.equal(first.released, false);
  assert.equal(newest.released, false);
  assert.equal(created.filter((audio) => !audio.released).length, 12);
  assert.equal(created[1].released, true);
});

test('a late media error after readiness does not poison subsequent playback', (t) => {
  const { cache, tick } = makeCache(t);
  cache.preload(['phrase']);
  tick();
  const original = created[0];
  original.dispatchEvent(new Event('canplaythrough'));
  original.error = { code: 2 };
  assert.notEqual(cache.get('phrase'), original);
  assert.equal(original.released, true);
  assert.equal(created.length, 2);
});
