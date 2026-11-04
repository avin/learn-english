import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../src/utils/settings.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
});
const { loadSettings, saveSettings, cursorZoneOptions, cursorScrollDurationOptions } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
);

let stored;
globalThis.localStorage = {
  getItem: () => stored ?? null,
  setItem: (_key, value) => {
    stored = value;
  },
};

test('new and existing users keep the previous scroll defaults', () => {
  for (stored of [undefined, '{}', '{"autoPlayOnReveal":false,"showAudioUnderline":false}']) {
    const settings = loadSettings();
    assert.equal(settings.cursorZonePercent, 30);
    assert.equal(settings.cursorScrollDurationMs, 600);
    assert.equal(settings.resetOnLessonEnd, false);
    assert.equal(settings.gamepadEnabled, true);
  }
  assert.equal(loadSettings().autoPlayOnReveal, false);
  assert.equal(loadSettings().showAudioUnderline, false);
});

test('every scroll preset, including zero, survives saving and loading', () => {
  for (const cursorZonePercent of cursorZoneOptions) {
    for (const cursorScrollDurationMs of cursorScrollDurationOptions) {
      const settings = { ...loadSettings(), cursorZonePercent, cursorScrollDurationMs };
      saveSettings(settings);
      assert.deepEqual(loadSettings(), settings);
    }
  }
});

test('invalid scroll preferences fall back without losing valid existing preferences', () => {
  for (const value of [-1, 101, 12, '30', null, {}, []]) {
    stored = JSON.stringify({ autoPlayOnReveal: false, cursorZonePercent: value });
    assert.equal(loadSettings().cursorZonePercent, 30);
    assert.equal(loadSettings().autoPlayOnReveal, false);
  }
  for (const value of [-1, 0, 100000, '600', null, {}, []]) {
    stored = JSON.stringify({ cursorZonePercent: 0, cursorScrollDurationMs: value });
    assert.equal(loadSettings().cursorScrollDurationMs, 600);
    assert.equal(loadSettings().cursorZonePercent, 0);
  }
});

test('corrupt saved settings recover to defaults', () => {
  for (stored of ['invalid json', 'null']) {
    const settings = loadSettings();
    assert.equal(settings.cursorZonePercent, 30);
    assert.equal(settings.cursorScrollDurationMs, 600);
    assert.equal(settings.resetOnLessonEnd, false);
  }
});

test('automatic lesson reset persists both boolean values and rejects invalid values', () => {
  for (const resetOnLessonEnd of [true, false]) {
    saveSettings({ ...loadSettings(), resetOnLessonEnd });
    assert.equal(loadSettings().resetOnLessonEnd, resetOnLessonEnd);
  }
  for (const resetOnLessonEnd of ['true', 1, null, {}, []]) {
    stored = JSON.stringify({ resetOnLessonEnd });
    assert.equal(loadSettings().resetOnLessonEnd, false);
  }
});

test('gamepad support defaults to enabled and persists either choice', () => {
  for (const gamepadEnabled of [true, false]) {
    saveSettings({ ...loadSettings(), gamepadEnabled });
    assert.equal(loadSettings().gamepadEnabled, gamepadEnabled);
  }
  for (const gamepadEnabled of ['false', 0, null, {}, []]) {
    stored = JSON.stringify({ gamepadEnabled });
    assert.equal(loadSettings().gamepadEnabled, true);
  }
});

test('translation direction persists and defaults to Russian for old or invalid settings', () => {
  for (const sourceLanguage of ['en', 'ru']) {
    saveSettings({ ...loadSettings(), sourceLanguage });
    assert.equal(loadSettings().sourceLanguage, sourceLanguage);
  }
  for (const sourceLanguage of [undefined, 'fr', true, 1, null, {}, []]) {
    stored = JSON.stringify({ sourceLanguage });
    assert.equal(loadSettings().sourceLanguage, 'ru');
  }
});
