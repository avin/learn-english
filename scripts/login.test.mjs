import React from 'react';
import TestRenderer from 'react-test-renderer';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test, { afterEach } from 'node:test';
import ts from 'typescript';

const { act, create } = TestRenderer;
const source = await readFile(
  new URL('../src/components/pages/LoginPage/LoginPage.tsx', import.meta.url),
  'utf8',
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
    jsx: ts.JsxEmit.React,
    esModuleInterop: true,
  },
});
let signIn;
const dependencies = {
  react: React,
  'firebase/auth': {
    GoogleAuthProvider: class {},
    signInWithPopup: (...args) => signIn(...args),
  },
  '@/firebase-config.ts': { auth: {} },
  './LoginPage.css': {},
};
const module = { exports: {} };
new Function('require', 'module', 'exports', outputText)(
  (name) => {
    assert.ok(name in dependencies, `Unexpected dependency: ${name}`);
    return dependencies[name];
  },
  module,
  module.exports,
);
const LoginPage = module.exports.default;
let renderer;
afterEach(() => {
  if (renderer) act(() => renderer.unmount());
});

const deferred = () => {
  let resolve, reject;
  const promise = new Promise((onResolve, onReject) => {
    resolve = onResolve;
    reject = onReject;
  });
  return { promise, resolve, reject };
};
const renderLogin = (onLocal = () => {}) => {
  act(() => {
    renderer = create(React.createElement(LoginPage, { onLocal, initialError: null }));
  });
};
const buttons = () => renderer.root.findAllByType('button');
const assertAvailable = () => {
  assert.ok(
    !buttons()[0].props.disabled,
    'Google sign-in must be available after closing its popup',
  );
  assert.ok(
    !buttons()[1].props.disabled,
    'Local mode must stay available while Firebase is pending',
  );
  assert.equal(renderer.root.findByType('section').props['aria-busy'] ?? false, false);
};

test('closing a popup does not lock either choice while Firebase delays its cancellation result', async () => {
  const request = deferred();
  signIn = () => request.promise;
  let localCalls = 0;
  renderLogin(() => {
    localCalls++;
  });
  let attempt;
  act(() => {
    attempt = buttons()[0].props.onClick();
  });
  // Firebase deliberately waits after popup closure; the page has no result yet.
  assertAvailable();
  act(() => {
    buttons()[1].props.onClick();
  });
  assert.equal(localCalls, 1);
  await act(async () => {
    request.reject({ code: 'auth/popup-closed-by-user' });
    await attempt;
  });
  assert.equal(renderer.root.findAllByProps({ role: 'alert' }).length, 0);
  assertAvailable();
});

test('Google can be retried before the previous cancelled popup has settled', async () => {
  const first = deferred();
  const second = deferred();
  let calls = 0;
  signIn = () => (++calls === 1 ? first.promise : second.promise);
  renderLogin();
  let firstAttempt, secondAttempt;
  act(() => {
    firstAttempt = buttons()[0].props.onClick();
  });
  assertAvailable();
  act(() => {
    secondAttempt = buttons()[0].props.onClick();
  });
  assert.equal(calls, 2);
  await act(async () => {
    second.reject({ code: 'auth/popup-blocked' });
    await secondAttempt;
  });
  const message = renderer.root.findByProps({ role: 'alert' }).children.join('');
  assert.match(message, /заблокировал окно Google/);
  await act(async () => {
    first.reject({ code: 'auth/network-request-failed' });
    await firstAttempt;
  });
  assert.equal(
    renderer.root.findByProps({ role: 'alert' }).children.join(''),
    message,
    'An older attempt must not replace the current result',
  );
  assertAvailable();
});

test('a successful sign-in does not leave a busy page', async () => {
  signIn = async () => ({});
  renderLogin();
  await act(async () => {
    await buttons()[0].props.onClick();
  });
  assertAvailable();
  assert.equal(renderer.root.findAllByProps({ role: 'alert' }).length, 0);
});

test('choosing local mode ignores late errors from a previous Google attempt', async () => {
  const request = deferred();
  signIn = () => request.promise;
  let localCalls = 0;
  renderLogin(() => {
    localCalls++;
  });
  let attempt;
  act(() => {
    attempt = buttons()[0].props.onClick();
  });
  act(() => {
    buttons()[1].props.onClick();
  });
  assert.equal(localCalls, 1);
  await act(async () => {
    request.reject({ code: 'auth/network-request-failed' });
    await attempt;
  });
  assert.equal(renderer.root.findAllByProps({ role: 'alert' }).length, 0);
});
