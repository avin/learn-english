import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../src/utils/mediaKeys.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
});
const { mediaAction, mediaKeyFromKeyboard } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
);

test('short media keys use the same actions as the keyboard arrows and replay', () => {
  assert.equal(mediaAction('next', false), 'ArrowRight');
  assert.equal(mediaAction('previous', false), 'ArrowLeft');
  assert.equal(mediaAction('play', false), 'replay');
  assert.equal(mediaAction('pause', false), 'replay');
});

test('holding next, previous, or play uses the lesson and restart actions', () => {
  assert.equal(mediaAction('next', true), 'nextLesson');
  assert.equal(mediaAction('previous', true), 'previousLesson');
  assert.equal(mediaAction('play', true), 'restart');
  assert.equal(mediaAction('pause', true), null);
});

test('desktop media keys map onto the same four buttons', () => {
  assert.equal(mediaKeyFromKeyboard('MediaTrackNext'), 'next');
  assert.equal(mediaKeyFromKeyboard('MediaTrackPrevious'), 'previous');
  assert.equal(mediaKeyFromKeyboard('MediaPlayPause'), 'play');
  assert.equal(mediaKeyFromKeyboard('MediaPlay'), 'play');
  assert.equal(mediaKeyFromKeyboard('MediaPause'), 'pause');
  assert.equal(mediaKeyFromKeyboard('ArrowRight'), null);
});
