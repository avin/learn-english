import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test, { beforeEach } from 'node:test';
import ts from 'typescript';

const compile = async (path, dependencies = {}) => {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
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

const progress = await compile('../src/utils/progress.ts');
const {
  createLocalProgressAdapter,
  createProgressStorage,
  localProgressKey,
  localModeKey,
  hasLocalSession,
  startLocalSession,
  clearLocalSession,
} = progress;
const stored = new Map();
const documents = new Map();
const writes = [];
const merge = (current, patch) => {
  const result = { ...current };
  for (const [key, value] of Object.entries(patch)) {
    result[key] =
      value && typeof value === 'object' && !Array.isArray(value)
        ? merge(current?.[key] ?? {}, value)
        : structuredClone(value);
  }
  return result;
};
const { createStorage } = await compile('../src/utils/storage.ts', {
  '@/utils/progress.ts': progress,
  '@/firebase-config.ts': { db: {} },
  'firebase/firestore/lite': {
    doc: (_db, collection, userId) => `${collection}/${userId}`,
    getDoc: async (reference) => ({
      exists: () => documents.has(reference),
      data: () => structuredClone(documents.get(reference)),
    }),
    setDoc: async (reference, data, options) => {
      writes.push({ reference, data: structuredClone(data), options });
      documents.set(reference, options?.merge ? merge(documents.get(reference), data) : data);
    },
  },
});

beforeEach((t) => {
  stored.clear();
  documents.clear();
  writes.length = 0;
  globalThis.localStorage = {
    getItem: (key) => stored.get(key) ?? null,
    setItem: (key, value) => stored.set(key, value),
    removeItem: (key) => stored.delete(key),
  };
  t.mock.method(console, 'error', () => {});
});

const noError = (error) => assert.equal(error, null);
const local = (onError = noError) => createStorage(null, onError);
const phrase = { ru: 'Я учу английский.', en: 'I learn English.', audio: { en: 'phrase.m4a' } };

test('a new local learner gets usable defaults without contacting Firebase', async () => {
  const storage = local();
  assert.equal(await storage.loadLastCourse(), 'titan');
  assert.equal(await storage.loadLastLesson('titan'), null);
  assert.deepEqual(await storage.loadLastOpenSentences('titan', '1'), []);
  assert.deepEqual(await storage.loadFavoriteTranslations(), []);
  assert.equal(writes.length, 0);
});

test('all progress survives a new local session, including empty arrays and independent lessons', async () => {
  const storage = local();
  await Promise.all([
    storage.saveLastCourse('express'),
    storage.saveLastLesson('titan', '12'),
    storage.saveLastLesson('express', 'A0 3-4'),
    storage.saveLastOpenSentences('titan', '12', [0, 3]),
    storage.saveLastOpenSentences('titan', '13', [1]),
    storage.saveLastOpenSentences('express', 'A0 3-4', [2]),
    storage.saveFavoriteTranslations([phrase]),
  ]);
  const restored = local();
  assert.equal(await restored.loadLastCourse(), 'express');
  assert.equal(await restored.loadLastLesson('titan'), '12');
  assert.equal(await restored.loadLastLesson('express'), 'A0 3-4');
  assert.deepEqual(await restored.loadLastOpenSentences('titan', '12'), [0, 3]);
  assert.deepEqual(await restored.loadLastOpenSentences('titan', '13'), [1]);
  assert.deepEqual(await restored.loadLastOpenSentences('express', 'A0 3-4'), [2]);
  assert.deepEqual(await restored.loadFavoriteTranslations(), [phrase]);
  await restored.saveLastOpenSentences('titan', '12', []);
  await restored.saveFavoriteTranslations([]);
  assert.deepEqual(await local().loadLastOpenSentences('titan', '12'), []);
  assert.deepEqual(await local().loadFavoriteTranslations(), []);
  assert.deepEqual(await local().loadLastOpenSentences('titan', '13'), [1]);
  assert.equal(writes.length, 0);
});

test('opening sign-in clears the mode choice while keeping local progress and settings', async () => {
  stored.set('settings', '{"autoPlayOnReveal":false}');
  await local().saveLastLesson('titan', '42');
  assert.equal(hasLocalSession(), false);
  startLocalSession();
  assert.equal(hasLocalSession(), true);
  assert.equal(stored.get(localModeKey), 'local');
  clearLocalSession();
  assert.equal(hasLocalSession(), false);
  assert.equal(await local().loadLastLesson('titan'), '42');
  assert.equal(stored.get('settings'), '{"autoPlayOnReveal":false}');
  assert.equal(stored.size, 2);
});

test('blocked browser storage prevents a misleading persistent local session', () => {
  globalThis.localStorage = {
    getItem() {
      throw new Error('Blocked');
    },
    setItem() {
      throw new Error('Blocked');
    },
    removeItem() {
      throw new Error('Blocked');
    },
  };
  assert.equal(hasLocalSession(), false);
  assert.throws(startLocalSession, /Blocked/);
  assert.doesNotThrow(clearLocalSession);
});

test('corrupt local progress is reported and protected against overwriting', async () => {
  for (const raw of ['invalid json', 'null', '[]', '"wrong"']) {
    stored.set(localProgressKey, raw);
    const errors = [];
    const storage = local((error) => errors.push(error));
    assert.equal(await storage.loadLastCourse(), 'titan');
    assert.equal(errors.at(-1).type, 'load');
    await storage.saveFavoriteTranslations([phrase]);
    assert.equal(stored.get(localProgressKey), raw);
    assert.equal(storage.hasUnsavedChanges(), false);
  }
});

test('invalid saved fields do not break lessons or favorites', async () => {
  stored.set(
    localProgressKey,
    JSON.stringify({
      lastCourse: 'unknown',
      lastLessons: { titan: 42 },
      lastOpenSentences: { titan: { 1: [0, -1, '3', 2.5, 4] } },
      favoriteTranslations: [null, {}, phrase, { ru: 'bad' }],
    }),
  );
  const storage = local();
  assert.equal(await storage.loadLastCourse(), 'titan');
  assert.equal(await storage.loadLastLesson('titan'), null);
  assert.deepEqual(await storage.loadLastOpenSentences('titan', '1'), [0, 4]);
  assert.deepEqual(await storage.loadFavoriteTranslations(), [phrase]);
});

test('failed saves remain queued and retry in order without dropping later progress', async () => {
  const errors = [];
  const adapter = createLocalProgressAdapter();
  let blocked = true;
  const storage = createProgressStorage(
    {
      read: adapter.read,
      patch(data) {
        if (blocked) throw new Error('Quota exceeded');
        return adapter.patch(data);
      },
    },
    (error) => errors.push(error),
  );
  await storage.saveLastCourse('titan');
  await storage.saveLastCourse('express');
  await storage.saveFavoriteTranslations([phrase]);
  assert.equal(storage.hasUnsavedChanges(), true);
  assert.equal(errors.at(-1).type, 'save');
  assert.equal(stored.has(localProgressKey), false);
  blocked = false;
  await storage.retrySaving();
  assert.equal(storage.hasUnsavedChanges(), false);
  assert.equal(errors.at(-1), null);
  assert.equal(await storage.loadLastCourse(), 'express');
  assert.deepEqual(await storage.loadFavoriteTranslations(), [phrase]);
});

test('asynchronous saves cannot complete out of order', async () => {
  let release;
  const calls = [];
  const firstWrite = new Promise((resolve) => {
    release = resolve;
  });
  const storage = createProgressStorage(
    {
      read: () => ({}),
      async patch(data) {
        calls.push(data.lastCourse);
        if (calls.length === 1) await firstWrite;
      },
    },
    noError,
  );
  const first = storage.saveLastCourse('titan');
  const second = storage.saveLastCourse('express');
  await Promise.resolve();
  assert.deepEqual(calls, ['titan']);
  release();
  await Promise.all([first, second]);
  assert.deepEqual(calls, ['titan', 'express']);
});

test('existing Google data keeps its schema and patches do not replace other lessons', async () => {
  documents.set('users/alice', {
    lastCourse: 'express',
    lastLessons: { titan: '10', express: 'A0 1-2' },
    lastOpenSentences: { titan: { 10: [1], 11: [2] } },
    favoriteTranslations: [phrase],
    unrelated: 'preserved',
  });
  const storage = createStorage('alice', noError);
  assert.equal(await storage.loadLastCourse(), 'express');
  assert.equal(await storage.loadLastLesson('titan'), '10');
  assert.deepEqual(await storage.loadFavoriteTranslations(), [phrase]);
  await Promise.all([
    storage.saveLastLesson('titan', '11'),
    storage.saveLastOpenSentences('titan', '10', []),
    storage.saveLastOpenSentences('express', 'A0 1-2', [3]),
  ]);
  const saved = documents.get('users/alice');
  assert.deepEqual(saved.lastLessons, { titan: '11', express: 'A0 1-2' });
  assert.deepEqual(saved.lastOpenSentences, {
    titan: { 10: [], 11: [2] },
    express: { 'A0 1-2': [3] },
  });
  assert.equal(saved.unrelated, 'preserved');
  assert.ok(writes.every((write) => write.options.merge === true));
});

test('local progress, separate Google accounts and pending writes keep their own destinations', async () => {
  const browser = local();
  await browser.saveLastLesson('titan', '9');
  const alice = createStorage('alice', noError);
  const aliceWrite = alice.saveLastLesson('titan', '20');
  const bob = createStorage('bob', noError);
  await bob.saveLastLesson('titan', '30');
  await aliceWrite;
  assert.equal(await browser.loadLastLesson('titan'), '9');
  assert.equal(await alice.loadLastLesson('titan'), '20');
  assert.equal(await bob.loadLastLesson('titan'), '30');
  assert.equal(documents.get('users/alice').favoriteTranslations, undefined);
  assert.equal(writes.length, 2);
});

test('a failed cloud read prevents subsequent default data from overwriting existing progress', async () => {
  const errors = [];
  let patched = false;
  const storage = createProgressStorage(
    {
      read: async () => {
        throw new Error('Network unavailable');
      },
      patch: () => {
        patched = true;
      },
    },
    (error) => errors.push(error),
    'cloud',
  );
  assert.deepEqual(await storage.loadFavoriteTranslations(), []);
  await storage.saveFavoriteTranslations([phrase]);
  await storage.retrySaving();
  assert.equal(patched, false);
  assert.equal(errors.at(-1).type, 'load');
});
