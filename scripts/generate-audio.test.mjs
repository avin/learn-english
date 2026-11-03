import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { generateAudio, planAudio, requestSpeech, selectLessons } from './generate-audio.mjs';

const voices = { en: 'Adrian', ru: 'Adrian' };
const fixtureFile = new URL('./fixtures/soniox.m4a', import.meta.url);

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
      jobs: planAudio([{ _id: 1, en: 'Hello' }], ['en'], voices),
      outputDirectory: directory,
      apiKey: 'fake-test-key',
    });
    assert.equal(mock.mock.callCount(), 1);
    const result = await readFile(join(directory, 'en_1.m4a'));
    assert.equal(result.subarray(4, 8).toString(), 'ftyp');
    assert.deepEqual(result, audio);
    assert.deepEqual(await readdir(directory), ['en_1.m4a']);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('rejects colliding filenames and missing text before generation', () => {
  assert.throws(() =>
    planAudio(
      [
        { _id: 1, en: 'Hi' },
        { _id: 1, en: 'Hello' },
      ],
      ['en'],
      voices,
    ),
  );
  assert.throws(() => planAudio([{ _id: 1, en: '' }], ['en'], voices));
});

test('requests each missing file, resumes after failure, and regenerates deleted audio', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'soniox-test-'));
  try {
    const outputDirectory = join(directory, 'output');
    await mkdir(outputDirectory);
    const audio = await readFile(fixtureFile);
    const tasks = [
      { _id: 1, en: 'Hello' },
      { _id: 2, en: 'Hello' },
      { _id: 3, en: 'Goodbye' },
    ];
    const jobs = planAudio(tasks, ['en'], voices);
    let calls = 0;
    const options = { jobs, outputDirectory, apiKey: 'fake-test-key' };
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
    assert.deepEqual(await readdir(outputDirectory), ['en_1.m4a']);
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
    const first = await readFile(join(outputDirectory, 'en_1.m4a'));
    assert.equal(first.subarray(4, 8).toString(), 'ftyp');
    assert.deepEqual(first, await readFile(join(outputDirectory, 'en_2.m4a')));
    tasks[0].en = 'Changed sentence';
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
    await rm(join(outputDirectory, 'en_1.m4a'));
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
    await rm(join(outputDirectory, 'en_1.m4a'));
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
      await mkdir(outputDirectory);
      jobs.push(
        ...planAudio(
          [
            { _id: 1, en: 'Hello' },
            { _id: 2, en: 'Goodbye' },
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
    assert.deepEqual((await readdir(join(directory, 'second'))).sort(), ['en_1.m4a']);
    assert.deepEqual(await generateAudio(options), { created: 1, skipped: 3, requests: 1 });
    assert.equal(calls, 3);
    assert.deepEqual(await generateAudio(options), { created: 0, skipped: 4, requests: 0 });
    assert.equal(calls, 3);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('API client sends the documented request and rejects HTTP errors or empty audio', async (t) => {
  const job = planAudio([{ _id: 1, en: 'Hello' }], ['en'], voices)[0];
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
