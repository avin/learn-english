import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(
  new URL('../src/components/pages/MainPage/Lesson/navigation.ts', import.meta.url),
  'utf8',
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
});
const { getNextSentence } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
);

const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
const order = [7, 2, 9];

test('any first arrow selects the first Russian sentence in display order', () => {
  for (const key of keys) {
    assert.deepEqual(getNextSentence(order, null, key), { idx: 7, column: 'ru' });
  }
});

test('horizontal navigation follows reading order and wraps in both directions', () => {
  const sequence = order.flatMap((idx) => [
    { idx, column: 'ru' },
    { idx, column: 'en' },
  ]);
  for (let i = 0; i < sequence.length; i++) {
    assert.deepEqual(
      getNextSentence(order, sequence[i], 'ArrowRight'),
      sequence[(i + 1) % sequence.length],
    );
    assert.deepEqual(
      getNextSentence(order, sequence[i], 'ArrowLeft'),
      sequence[(i + sequence.length - 1) % sequence.length],
    );
  }
});

test('vertical navigation keeps the language and wraps within its column', () => {
  for (const column of ['ru', 'en']) {
    for (let i = 0; i < order.length; i++) {
      assert.deepEqual(getNextSentence(order, { idx: order[i], column }, 'ArrowDown'), {
        idx: order[(i + 1) % order.length],
        column,
      });
      assert.deepEqual(getNextSentence(order, { idx: order[i], column }, 'ArrowUp'), {
        idx: order[(i + order.length - 1) % order.length],
        column,
      });
    }
  }
});

test('a single row wraps vertically and switches languages horizontally', () => {
  for (const column of ['ru', 'en']) {
    const selected = { idx: 4, column };
    for (const key of ['ArrowUp', 'ArrowDown']) {
      assert.deepEqual(getNextSentence([4], selected, key), selected);
    }
    for (const key of ['ArrowLeft', 'ArrowRight']) {
      assert.deepEqual(getNextSentence([4], selected, key), {
        idx: 4,
        column: column === 'ru' ? 'en' : 'ru',
      });
    }
  }
});

test('empty lists have no selection and a missing selection restarts at the first sentence', () => {
  for (const key of keys) {
    assert.equal(getNextSentence([], null, key), null);
    assert.equal(getNextSentence([], { idx: 1, column: 'en' }, key), null);
    assert.deepEqual(getNextSentence(order, { idx: 100, column: 'en' }, key), {
      idx: 7,
      column: 'ru',
    });
  }
});
