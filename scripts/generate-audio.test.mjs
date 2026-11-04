import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { setImmediate } from 'node:timers/promises';
import {
  generateAudio,
  loadAudioJobs,
  planAudio,
  requestSpeech,
  selectLessons,
} from './generate-audio.mjs';

const voices = { en: 'Adrian', ru: 'Adrian' };
const fixtureFile = new URL('./fixtures/soniox.m4a', import.meta.url);

function deferred() {
  let resolve;
  const promise = new Promise((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

test('names audio files with padded ids in the audio subdirectory', () => {
  const tasks = [1, 12, 123, 1234].map((id) => ({
    id,
    ru: { text: 'Пример', audio: false },
    en: { text: 'Example', audio: false },
  }));
  assert.deepEqual(
    planAudio(tasks, ['en', 'ru'], voices).map((job) => job.filename),
    [
      'audio/001_en.m4a',
      'audio/001_ru.m4a',
      'audio/012_en.m4a',
      'audio/012_ru.m4a',
      'audio/123_en.m4a',
      'audio/123_ru.m4a',
      'audio/1234_en.m4a',
      'audio/1234_ru.m4a',
    ],
  );
});

test('runs sequentially by default and persists progress before the next request', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'soniox-flags-test-'));
  try {
    const tasksFile = join(directory, 'tasks.json');
    const tasks = [1, 2, 3].map((id) => ({
      id,
      ru: { text: `Russian ${id}`, audio: id === 2 },
      en: { text: `English ${id}`, audio: id === 3 },
    }));
    const original = JSON.stringify(tasks);
    const audio = await readFile(fixtureFile);
    await writeFile(tasksFile, original);
    await mkdir(join(directory, 'audio'));
    await writeFile(join(directory, 'audio/001_en.m4a'), audio);
    await writeFile(join(directory, 'audio/001_ru.m4a'), audio);
    const readTasks = async () => JSON.parse(await readFile(tasksFile, 'utf8'));
    const jobs = await loadAudioJobs(tasksFile, ['en'], voices);
    await generateAudio({ jobs, dryRun: true, limit: 1 });
    assert.equal(await readFile(tasksFile, 'utf8'), original);
    let calls = 0;
    await assert.rejects(
      generateAudio({
        jobs,
        apiKey: 'fake-test-key',
        request: async () => {
          const saved = await readTasks();
          assert.equal(saved[0].en.audio, true);
          assert.equal(saved[0].ru.audio, true);
          assert.equal(saved[1].ru.audio, false);
          assert.equal(saved[2].en.audio, false);
          calls++;
          if (calls === 2) {
            assert.equal(saved[1].en.audio, true);
            throw new Error('simulated failure');
          }
          assert.equal(saved[1].en.audio, false);
          return audio;
        },
      }),
      /simulated failure/,
    );
    assert.equal(calls, 2);
    assert.deepEqual(
      (await readTasks()).map((task) => task.en.audio),
      [true, true, false],
    );
    await generateAudio({
      jobs: await loadAudioJobs(tasksFile, ['en'], voices),
      apiKey: 'fake-test-key',
      limit: 1,
      request: async () => audio,
    });
    assert.deepEqual(
      (await readTasks()).map((task) => task.en.audio),
      [true, true, true],
    );
    await rm(join(directory, 'audio/003_en.m4a'));
    await assert.rejects(
      generateAudio({
        jobs: await loadAudioJobs(tasksFile, ['en'], voices),
        apiKey: 'fake-test-key',
        request: async () => {
          throw new Error('failed retry');
        },
      }),
      /failed retry/,
    );
    assert.equal((await readTasks())[2].en.audio, false);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test(
  'runs four requests when configured and persists out-of-order completions for one lesson',
  { timeout: 5000 },
  async () => {
    const directory = await mkdtemp(join(tmpdir(), 'soniox-parallel-test-'));
    const gates = Array.from({ length: 4 }, () => deferred());
    try {
      const tasksFile = join(directory, 'tasks.json');
      const tasks = Array.from({ length: 8 }, (_, index) => ({
        id: index + 1,
        en: { text: String(index + 1), audio: false },
        ru: { text: 'Example', audio: false },
      }));
      await writeFile(tasksFile, JSON.stringify(tasks));
      const audio = await readFile(fixtureFile);
      const firstBatch = deferred();
      const nextBatch = deferred();
      let active = 0;
      let maximum = 0;
      const requested = [];
      const running = generateAudio({
        jobs: await loadAudioJobs(tasksFile, ['en'], voices),
        apiKey: 'fake-test-key',
        concurrency: 4,
        request: async (config) => {
          const id = Number(config.text);
          requested.push(id);
          active++;
          maximum = Math.max(maximum, active);
          if (requested.length === 4) firstBatch.resolve();
          if (requested.length === 5) nextBatch.resolve();
          if (id <= 4) await gates[id - 1].promise;
          active--;
          return audio;
        },
      });
      await firstBatch.promise;
      assert.equal(active, 4);
      assert.equal(requested.length, 4);
      // The fourth result must be saved while the first three are still pending.
      gates[3].resolve();
      await nextBatch.promise;
      assert.equal(JSON.parse(await readFile(tasksFile, 'utf8'))[3].en.audio, true);
      for (const gate of gates) gate.resolve();
      assert.deepEqual(await running, { created: 8, skipped: 0, requests: 8 });
      assert.equal(maximum, 4);
      assert.deepEqual([...requested].sort((a, b) => a - b), [1, 2, 3, 4, 5, 6, 7, 8]);
      const saved = JSON.parse(await readFile(tasksFile, 'utf8'));
      assert.ok(saved.every((task) => task.en.audio && !task.ru.audio));
      assert.deepEqual(await readdir(directory), ['audio', 'tasks.json']);
      assert.equal((await readdir(join(directory, 'audio'))).length, 8);
      assert.deepEqual(
        await generateAudio({
          jobs: await loadAudioJobs(tasksFile, ['en'], voices),
          apiKey: 'fake-test-key',
          request: async () => {
            throw new Error('Existing files must be skipped');
          },
        }),
        { created: 0, skipped: 8, requests: 0 },
      );
    } finally {
      for (const gate of gates) gate.resolve();
      await rm(directory, { recursive: true, force: true });
    }
  },
);

test(
  'stops scheduling after a failure and saves in-flight results before rejecting',
  { timeout: 5000 },
  async () => {
    const directory = await mkdtemp(join(tmpdir(), 'soniox-drain-test-'));
    const fail = deferred();
    const finish = deferred();
    try {
      const tasksFile = join(directory, 'tasks.json');
      const tasks = Array.from({ length: 6 }, (_, index) => ({
        id: index + 1,
        en: { text: String(index + 1), audio: false },
        ru: { text: 'Example', audio: false },
      }));
      await writeFile(tasksFile, JSON.stringify(tasks));
      const audio = await readFile(fixtureFile);
      const started = deferred();
      const requested = [];
      let settled = false;
      const running = generateAudio({
        jobs: await loadAudioJobs(tasksFile, ['en'], voices),
        apiKey: 'fake-test-key',
        concurrency: 2,
        request: async (config) => {
          const id = Number(config.text);
          requested.push(id);
          if (requested.length === 2) started.resolve();
          if (id === 1) {
            await fail.promise;
            throw new Error('simulated network failure');
          }
          await finish.promise;
          return audio;
        },
      });
      const rejected = assert.rejects(running, /simulated network failure/);
      running.then(
        () => {
          settled = true;
        },
        () => {
          settled = true;
        },
      );
      await started.promise;
      fail.resolve();
      await setImmediate();
      assert.equal(settled, false);
      assert.deepEqual([...requested].sort((a, b) => a - b), [1, 2]);
      finish.resolve();
      await rejected;
      assert.deepEqual([...requested].sort((a, b) => a - b), [1, 2]);
      assert.deepEqual(
        JSON.parse(await readFile(tasksFile, 'utf8')).map((task) => task.en.audio),
        [false, true, false, false, false, false],
      );
      const resumed = [];
      assert.deepEqual(
        await generateAudio({
          jobs: await loadAudioJobs(tasksFile, ['en'], voices),
          apiKey: 'fake-test-key',
          request: async (config) => {
            resumed.push(Number(config.text));
            return audio;
          },
        }),
        { created: 5, skipped: 1, requests: 5 },
      );
      assert.deepEqual(
        resumed.sort((a, b) => a - b),
        [1, 3, 4, 5, 6],
      );
      assert.ok(JSON.parse(await readFile(tasksFile, 'utf8')).every((task) => task.en.audio));
    } finally {
      fail.resolve();
      finish.resolve();
      await rm(directory, { recursive: true, force: true });
    }
  },
);

test('rejects invalid concurrency before touching files or making requests', async () => {
  for (const concurrency of [0, -1, 1.5, Infinity, NaN]) {
    await assert.rejects(
      generateAudio({ jobs: [], concurrency }),
      /--concurrency must be a positive integer/,
    );
  }
});

test('accepts Soniox AAC in MP4 with application/octet-stream and creates M4A', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'soniox-response-test-'));
  try {
    const audio = await readFile(fixtureFile);
    const mock = t.mock.method(
      globalThis,
      'fetch',
      async () =>
        new Response(audio, {
          headers: { 'Content-Type': 'application/octet-stream' },
        }),
    );
    await generateAudio({
      jobs: planAudio([{ id: 1, en: { text: 'Hello', audio: false } }], ['en'], voices),
      outputDirectory: directory,
      apiKey: 'fake-test-key',
    });
    assert.equal(mock.mock.callCount(), 1);
    const result = await readFile(join(directory, 'audio/001_en.m4a'));
    assert.equal(result.subarray(4, 8).toString(), 'ftyp');
    assert.deepEqual(result, audio);
    assert.deepEqual(await readdir(directory), ['audio']);
    assert.deepEqual(await readdir(join(directory, 'audio')), ['001_en.m4a']);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('rejects colliding filenames and missing text before generation', () => {
  assert.throws(() =>
    planAudio(
      [
        { id: 1, en: { text: 'Hi', audio: false } },
        { id: 1, en: { text: 'Hello', audio: false } },
      ],
      ['en'],
      voices,
    ),
  );
  assert.throws(() => planAudio([{ id: 1, en: { text: '', audio: false } }], ['en'], voices));
});

test('requests each missing file, resumes after failure, and regenerates deleted audio', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'soniox-test-'));
  try {
    const outputDirectory = join(directory, 'output');
    await mkdir(outputDirectory);
    const audio = await readFile(fixtureFile);
    const tasks = [
      { id: 1, en: { text: 'Hello', audio: false } },
      { id: 2, en: { text: 'Hello', audio: false } },
      { id: 3, en: { text: 'Goodbye', audio: false } },
    ];
    const jobs = planAudio(tasks, ['en'], voices);
    let calls = 0;
    const options = { jobs, outputDirectory, apiKey: 'fake-test-key', concurrency: 1 };
    await assert.rejects(
      generateAudio({
        ...options,
        request: async () => {
          calls++;
          if (calls === 2) throw new Error('simulated interruption');
          return audio;
        },
      }),
      /simulated interruption/,
    );
    assert.equal(calls, 2);
    assert.deepEqual(await readdir(join(outputDirectory, 'audio')), ['001_en.m4a']);
    calls = 0;
    await generateAudio({
      ...options,
      request: async () => {
        calls++;
        return audio;
      },
    });
    assert.equal(calls, 2);
    await generateAudio({
      ...options,
      request: async () => {
        throw new Error('Existing file must be skipped');
      },
    });
    const first = await readFile(join(outputDirectory, 'audio/001_en.m4a'));
    assert.equal(first.subarray(4, 8).toString(), 'ftyp');
    assert.deepEqual(first, await readFile(join(outputDirectory, 'audio/002_en.m4a')));
    tasks[0].en.text = 'Changed sentence';
    calls = 0;
    await generateAudio({
      ...options,
      jobs: planAudio(tasks, ['en'], voices),
      request: async () => {
        calls++;
        return audio;
      },
    });
    assert.equal(calls, 0);
    await rm(join(outputDirectory, 'audio/001_en.m4a'));
    await generateAudio({
      ...options,
      jobs: planAudio(tasks, ['en'], voices),
      request: async () => {
        calls++;
        return audio;
      },
    });
    assert.equal(calls, 1);
    // Deleting a file triggers a fresh request even with unchanged text and settings.
    await rm(join(outputDirectory, 'audio/001_en.m4a'));
    await generateAudio({
      ...options,
      jobs: planAudio(tasks, ['en'], voices),
      request: async () => {
        calls++;
        return audio;
      },
    });
    assert.equal(calls, 2);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('selects exact lessons, wildcards, multiple patterns and all lessons in natural order', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'soniox-lessons-test-'));
  try {
    for (const name of [
      'express/A0 11-12',
      'express/A0 1-2',
      'express/A1 1-2',
      'titan/1',
      'titan/2',
    ]) {
      await mkdir(join(directory, name), { recursive: true });
      await writeFile(join(directory, name, 'tasks.json'), '[]');
    }
    const names = (lessons) => lessons.map((lesson) => lesson.name);
    assert.deepEqual(names(await selectLessons(directory, [])), ['express/A0 1-2']);
    assert.deepEqual(names(await selectLessons(directory, ['express/A0*'])), [
      'express/A0 1-2',
      'express/A0 11-12',
    ]);
    assert.deepEqual(
      names(await selectLessons(directory, ['express/A0*', 'express/A0 1-2', 'titan/2'])),
      ['express/A0 1-2', 'express/A0 11-12', 'titan/2'],
    );
    assert.equal((await selectLessons(directory, [], true)).length, 5);
    assert.equal((await selectLessons(directory, ['*/*'])).length, 5);
    assert.deepEqual(names(await selectLessons(directory, ['express\\A1*'])), ['express/A1 1-2']);
    await assert.rejects(selectLessons(directory, ['express/A9*']), /No lessons match/);
    await assert.rejects(selectLessons(directory, ['titan/1'], true), /or --all/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('shares the limit across lessons and only requests missing or empty output files', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'soniox-limit-test-'));
  try {
    const jobs = [];
    for (const lesson of ['first', 'second']) {
      const outputDirectory = join(directory, lesson);
      await mkdir(join(outputDirectory, 'audio'), { recursive: true });
      jobs.push(
        ...planAudio(
          [
            { id: 1, en: { text: 'Hello', audio: false } },
            { id: 2, en: { text: 'Goodbye', audio: false } },
          ],
          ['en'],
          voices,
        ).map((job) => ({ ...job, outputDirectory })),
      );
    }
    const existing = join(jobs[0].outputDirectory, jobs[0].filename);
    await writeFile(existing, 'existing-audio');
    let calls = 0;
    const audio = await readFile(fixtureFile);
    const options = {
      jobs,
      apiKey: 'fake-test-key',
      limit: 2,
      request: async () => {
        calls++;
        return audio;
      },
    };
    const preview = await generateAudio({ ...options, dryRun: true });
    assert.equal(preview.created, 0);
    assert.equal(calls, 0);
    // Empty files are unfinished and must be recreated.
    await writeFile(join(jobs[1].outputDirectory, jobs[1].filename), '');
    assert.deepEqual(await generateAudio(options), { created: 2, skipped: 1, requests: 2 });
    assert.equal(calls, 2);
    assert.equal(await readFile(existing, 'utf8'), 'existing-audio');
    assert.deepEqual((await readdir(join(directory, 'second', 'audio'))).sort(), ['001_en.m4a']);
    assert.deepEqual(await generateAudio(options), { created: 1, skipped: 3, requests: 1 });
    assert.equal(calls, 3);
    assert.deepEqual(await generateAudio(options), { created: 0, skipped: 4, requests: 0 });
    assert.equal(calls, 3);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('API client sends the documented request and rejects HTTP errors or empty audio', async (t) => {
  const job = planAudio([{ id: 1, en: { text: 'Hello', audio: false } }], ['en'], voices)[0];
  const mock = t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://tts-rt.soniox.com/tts');
    assert.equal(options.headers.Authorization, 'Bearer fake-test-key');
    assert.deepEqual(JSON.parse(options.body), job.config);
    return new Response(new Uint8Array([1, 2]), { headers: { 'Content-Type': 'audio/aac' } });
  });
  assert.deepEqual(await requestSpeech(job.config, 'fake-test-key'), Buffer.from([1, 2]));
  mock.mock.mockImplementation(
    async () =>
      new Response(
        JSON.stringify({
          error_type: 'rate_limit_exceeded',
          request_id: 'request-test',
        }),
        { status: 429 },
      ),
  );
  await assert.rejects(
    requestSpeech(job.config, 'fake-test-key'),
    /429.*rate_limit_exceeded.*request-test/,
  );
  mock.mock.mockImplementation(
    async () => new Response('', { headers: { 'Content-Type': 'audio/aac' } }),
  );
  await assert.rejects(requestSpeech(job.config, 'fake-test-key'), /empty audio/);
  mock.mock.mockImplementation(
    async () => new Response('<html>Error</html>', { headers: { 'Content-Type': 'text/html' } }),
  );
  await assert.rejects(
    requestSpeech(job.config, 'fake-test-key'),
    /non-audio.*HTTP 200.*text\/html/,
  );
});
