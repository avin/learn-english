import React from 'react';
import TestRenderer from 'react-test-renderer';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';
import { mockClock } from './helpers/clock.mjs';

const source = await readFile(new URL('../src/utils/mediaKeys.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
});
const mediaKeys = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
);
const { mediaAction, mediaKeyFromKeyboard } = mediaKeys;
const guardSource = await readFile(new URL('../src/utils/pressGuard.ts', import.meta.url), 'utf8');
const guardCode = ts.transpileModule(guardSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
}).outputText;
const pressGuard = await import(
  `data:text/javascript;base64,${Buffer.from(guardCode).toString('base64')}`
);
const hookSource = await readFile(new URL('../src/utils/useMediaKeys.ts', import.meta.url), 'utf8');
const hookCode = ts.transpileModule(hookSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const { act, create } = TestRenderer;

const setup = (t, { native = false, onAction } = {}) => {
  const tick = mockClock(t);
  const globals = ['window', 'document', 'navigator', 'HTMLElement'];
  const originals = globals.map((key) => Object.getOwnPropertyDescriptor(globalThis, key));
  globalThis.window = Object.assign(new EventTarget(), {
    setTimeout: (...args) => setTimeout(...args),
    clearTimeout: (id) => clearTimeout(id),
  });
  globalThis.document = Object.assign(new EventTarget(), {
    activeElement: null,
    hidden: false,
    querySelector: () => null,
  });
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: { userAgent: native ? 'Android' : 'Windows' },
  });
  globalThis.HTMLElement = class {};
  const module = { exports: {} };
  const dependencies = {
    react: React,
    '@tauri-apps/api/core': { isTauri: () => native },
    './mediaKeys.ts': mediaKeys,
    './pressGuard.ts': pressGuard,
  };
  new Function('require', 'module', 'exports', hookCode)(
    (name) => {
      assert.ok(name in dependencies, `Unexpected dependency: ${name}`);
      return dependencies[name];
    },
    module,
    module.exports,
  );
  const actions = [];
  const handler = (action) => {
    actions.push(action);
    onAction?.(action);
  };
  const Harness = ({ suspended = false, context = 'titan/46' }) => {
    module.exports.useMediaKeys(handler, suspended, context);
    return null;
  };
  let renderer;
  act(() => {
    renderer = create(React.createElement(Harness));
  });
  t.after(() => {
    act(() => renderer.unmount());
    globals.forEach((key, idx) => {
      if (originals[idx]) Object.defineProperty(globalThis, key, originals[idx]);
      else delete globalThis[key];
    });
  });
  const key = (type, key = 'MediaTrackNext', props = {}) => {
    const event = Object.assign(new Event(type, { cancelable: true }), { key, ...props });
    act(() => document.dispatchEvent(event));
    return event;
  };
  const android = (detail) => {
    const event = Object.assign(new Event('android-media-key'), {
      detail: detail == null ? detail : { context: 'titan/46', ...detail },
    });
    act(() => window.dispatchEvent(event));
  };
  return {
    actions,
    tick: (ms) => act(() => tick(ms)),
    key,
    android,
    update: (props) => act(() => renderer.update(React.createElement(Harness, props))),
  };
};

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

test('a released desktop tap never changes the lesson', (t) => {
  const s = setup(t);
  s.key('keydown');
  s.tick(100);
  s.key('keyup');
  s.tick(5_000);
  assert.deepEqual(s.actions, ['ArrowRight']);
});

test('desktop holds fire once at 1501 ms, including repeated keydown events', (t) => {
  const s = setup(t);
  s.key('keydown');
  s.tick(1_500);
  assert.deepEqual(s.actions, ['ArrowRight']);
  s.key('keydown', 'MediaTrackNext', { repeat: true });
  s.tick(1);
  s.key('keydown', 'MediaTrackNext', { repeat: true });
  s.tick(10_000);
  s.key('keyup');
  assert.deepEqual(s.actions, ['ArrowRight', 'nextLesson']);
});

test('a fresh initial keydown replaces an unfinished press', (t) => {
  const s = setup(t);
  s.key('keydown');
  s.tick(100);
  s.key('keydown');
  s.key('keyup');
  s.tick(2_000);
  assert.deepEqual(s.actions, ['ArrowRight', 'ArrowRight']);
});

test('all desktop media buttons reject rapid taps without scheduling ghost holds', (t) => {
  const s = setup(t);
  for (const [key, action] of [
    ['MediaTrackNext', 'ArrowRight'],
    ['MediaTrackPrevious', 'ArrowLeft'],
    ['MediaPlayPause', 'replay'],
    ['MediaPlay', 'replay'],
    ['MediaPause', 'replay'],
  ]) {
    const before = s.actions.length;
    s.key('keydown', key);
    s.key('keyup', key);
    s.tick(20);
    s.key('keydown', key);
    s.key('keyup', key);
    s.tick(79);
    s.key('keydown', key);
    s.key('keyup', key);
    assert.deepEqual(s.actions.slice(before), [action], key);
    s.tick(1);
    s.key('keydown', key);
    s.key('keyup', key);
    s.tick(2_000);
    assert.deepEqual(s.actions.slice(before), [action, action], key);
  }
});

test('a duplicate initial media keydown keeps the original hold deadline', (t) => {
  const s = setup(t);
  s.key('keydown');
  s.tick(20);
  s.key('keydown');
  s.tick(1_480);
  assert.deepEqual(s.actions, ['ArrowRight']);
  s.tick(1);
  assert.deepEqual(s.actions, ['ArrowRight', 'nextLesson']);
  s.key('keyup');
});

test('different media buttons remain independent and lesson changes retain the guard', (t) => {
  const s = setup(t);
  s.key('keydown', 'MediaTrackNext');
  s.key('keydown', 'MediaTrackPrevious');
  assert.deepEqual(s.actions, ['ArrowRight', 'ArrowLeft']);
  s.tick(20);
  s.update({ context: 'titan/47' });
  s.key('keydown', 'MediaTrackNext');
  s.tick(2_000);
  assert.deepEqual(s.actions, ['ArrowRight', 'ArrowLeft']);
});

test('focus loss during the short action cannot leave a ghost hold timer', (t) => {
  const s = setup(t, { onAction: () => window.dispatchEvent(new Event('blur')) });
  s.key('keydown');
  s.tick(2_000);
  assert.deepEqual(s.actions, ['ArrowRight']);
});

test('changing the lesson cancels the previous lesson hold', (t) => {
  const s = setup(t);
  s.key('keydown');
  s.tick(100);
  s.update({ context: 'titan/47' });
  s.tick(2_000);
  assert.deepEqual(s.actions, ['ArrowRight']);
});

test('suspension, hiding and blur cancel pending desktop holds', (t) => {
  const s = setup(t);
  for (const cancel of [
    () => s.update({ suspended: true }),
    () => {
      document.hidden = true;
      document.dispatchEvent(new Event('visibilitychange'));
    },
    () => window.dispatchEvent(new Event('blur')),
  ]) {
    s.update({ suspended: false });
    document.hidden = false;
    s.key('keydown');
    act(() => {
      cancel();
    });
    s.tick(2_000);
  }
  assert.deepEqual(s.actions, ['ArrowRight', 'ArrowRight', 'ArrowRight']);
});

test('Android receives resolved actions without creating JavaScript hold timers', (t) => {
  const s = setup(t, { native: true });
  s.android({ key: 'next', held: false });
  s.tick(5_000);
  assert.deepEqual(s.actions, ['ArrowRight']);
  s.android({ key: 'next', held: true });
  s.tick(5_000);
  assert.deepEqual(s.actions, ['ArrowRight', 'nextLesson']);
  s.key('keydown');
  s.tick(5_000);
  assert.deepEqual(s.actions, ['ArrowRight', 'nextLesson']);
});

test('invalid Android events and suspended controls cannot execute actions', (t) => {
  const s = setup(t, { native: true });
  for (const detail of [
    null,
    {},
    { key: 'constructor', held: false },
    { key: 'next' },
    { key: 'next', phase: 'down' },
    { key: 'next', held: 'true' },
  ])
    s.android(detail);
  s.update({ suspended: true });
  s.android({ key: 'next', held: true });
  s.tick(5_000);
  assert.deepEqual(s.actions, []);
});

test('late Android events from another lesson cannot act on the current lesson', (t) => {
  const s = setup(t, { native: true });
  s.update({ context: 'titan/47' });
  s.android({ key: 'next', held: true, context: 'titan/46' });
  s.android({ key: 'next', held: true, context: undefined });
  assert.deepEqual(s.actions, []);
  s.android({ key: 'next', held: false, context: 'titan/47' });
  s.tick(2_000);
  assert.deepEqual(s.actions, ['ArrowRight']);
});
