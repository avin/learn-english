import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../src/utils/gamepad.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
});
const { createGamepadReader } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
);

const pad = (buttons = [], axes = [0, 0], extra = {}) => ({
  id: 'Test controller',
  index: 0,
  connected: true,
  mapping: 'standard',
  buttons: Array.from({ length: 17 }, (_, index) => ({ pressed: buttons.includes(index) })),
  axes,
  ...extra,
});

test('D-pad and left stick map to the same four navigation actions', () => {
  for (const [button, axes, action] of [
    [12, [0, -1], 'ArrowUp'],
    [13, [0, 1], 'ArrowDown'],
    [14, [-1, 0], 'ArrowLeft'],
    [15, [1, 0], 'ArrowRight'],
  ]) {
    for (const gamepad of [pad([button]), pad([], axes), pad([button], axes)]) {
      const read = createGamepadReader();
      assert.equal(read([gamepad], 0), action);
      assert.equal(read([gamepad], 16), null);
    }
  }
});

test('stick drift is ignored, the dominant axis wins and D-pad takes priority', () => {
  const read = createGamepadReader();
  assert.equal(read([pad([], [0.2, -0.3])], 0), null);
  assert.equal(read([pad([], [0.8, -0.6])], 16), 'ArrowRight');
  assert.equal(read([pad([], [0.6, -0.8])], 32), 'ArrowUp');
  assert.equal(read([pad([14], [0, 1])], 48), 'ArrowLeft');
  assert.equal(read([pad([14, 15])], 64), null);
});

test('holding a direction repeats after a delay without catching up missed frames', () => {
  const read = createGamepadReader();
  const down = pad([13]);
  assert.equal(read([down], 0), 'ArrowDown');
  assert.equal(read([down], 399), null);
  assert.equal(read([down], 400), 'ArrowDown');
  assert.equal(read([down], 549), null);
  assert.equal(read([down], 550), 'ArrowDown');
  assert.equal(read([down], 5000), 'ArrowDown');
  assert.equal(read([down], 5001), null);
  assert.equal(read([pad([15])], 5010), 'ArrowRight');
  assert.equal(read([pad()], 5020), null);
  assert.equal(read([down], 5030), 'ArrowDown');
});

test('replay, restart and lesson changes fire once per press, even across long holds', () => {
  for (const [button, action] of [
    [0, 'replay'],
    [4, 'previousLesson'],
    [5, 'nextLesson'],
    [9, 'restart'],
  ]) {
    const read = createGamepadReader();
    assert.equal(read([pad([button])], 0), action);
    assert.equal(read([pad([button])], 400), null);
    assert.equal(read([pad([button])], 10000), null);
    assert.equal(read([pad()], 10010), null);
    assert.equal(read([pad([button])], 10020), action);
  }
});

test('Start takes priority and holding it does not restart again during other input', () => {
  const read = createGamepadReader();
  assert.equal(read([pad([9, 15, 0, 5])], 0), 'restart');
  assert.equal(read([pad([9])], 1000), null);
  assert.equal(read([pad([9, 12])], 2000), null);
  assert.equal(read([pad([9])], 3000, false), null);
  assert.equal(read([pad([9])], 4000), null);
  assert.equal(read([pad()], 4010), null);
  assert.equal(read([pad([9])], 4020), 'restart');
});

test('resuming after settings, editing or focus loss requires releasing held controls', () => {
  const read = createGamepadReader();
  assert.equal(read([pad([15])], 0), 'ArrowRight');
  assert.equal(read([], 100, false), null);
  assert.equal(read([pad([15])], 1000), null);
  assert.equal(read([pad([15])], 2000), null);
  assert.equal(read([pad()], 2010), null);
  assert.equal(read([pad([15])], 2020), 'ArrowRight');
  assert.equal(read([pad([0])], 2030, false), null);
  assert.equal(read([pad([0])], 2040), null);
  assert.equal(read([pad()], 2050), null);
  assert.equal(read([pad([0])], 2060), 'replay');
});

test('holding replay or a bumper while another button changes does not retrigger it', () => {
  const read = createGamepadReader();
  assert.equal(read([pad([0])], 0), 'replay');
  assert.equal(read([pad([0, 5])], 16), 'nextLesson');
  assert.equal(read([pad([0])], 32), null);
  assert.equal(read([pad([0])], 1000), null);
  assert.equal(read([pad([0, 5])], 1016), 'nextLesson');
  assert.equal(read([pad([0, 4, 5])], 1032), null);
  assert.equal(read([pad([0, 5])], 1048), null);
});

test('disconnection clears input and only the first connected standard controller is used', () => {
  const read = createGamepadReader();
  assert.equal(read([null, pad([15], [], { mapping: '' })], 0), null);
  assert.equal(read([pad([15], [], { connected: false })], 1), null);
  assert.equal(read([null, pad([4])], 2), 'previousLesson');
  assert.equal(read([null], 3), null);
  assert.equal(read([pad([4])], 4), 'previousLesson');
  assert.equal(read([pad(), pad([15], [], { index: 1 })], 5), null);
  assert.equal(read([null, pad([15], [], { index: 1 })], 6), 'ArrowRight');
});
