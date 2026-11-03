import { readFile, readdir, rename, stat, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

const root = fileURLToPath(new URL('../', import.meta.url));
const translationsDirectory = join(root, 'src/assets/translations');

export async function selectLessons(directory, patterns, all = false) {
  if (all && patterns.length) throw new Error('Use lesson patterns or --all, not both.');
  const lessons = [];
  async function walk(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) await walk(path);
      else if (entry.name === 'tasks.json') {
        lessons.push({ name: relative(directory, current).replaceAll('\\', '/'), tasksFile: path });
      }
    }
  }
  await walk(directory);
  lessons.sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }));
  if (all) return lessons;
  const selected = new Set();
  for (const pattern of patterns.length ? patterns : ['express/A0 1-2']) {
    const normalized = pattern.replaceAll('\\', '/').replace(/\/$/, '');
    const expression = new RegExp(
      '^' +
        normalized
          .split('*')
          .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
          .join('[^/]*') +
        '$',
    );
    const matches = lessons.filter((lesson) => expression.test(lesson.name));
    if (!matches.length) throw new Error(`No lessons match: ${pattern}`);
    for (const lesson of matches) selected.add(lesson);
  }
  return lessons.filter((lesson) => selected.has(lesson));
}

async function hasAudio(path) {
  try {
    const info = await stat(path);
    return info.isFile() && info.size > 0;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return false;
  }
}

export async function pendingAudio(jobs, limit = Infinity) {
  const pending = [];
  let skipped = 0;
  let missing = 0;
  for (const job of jobs) {
    if (await hasAudio(join(job.outputDirectory, job.filename))) skipped++;
    else {
      missing++;
      if (pending.length < limit) pending.push(job);
    }
  }
  return { pending, skipped, remaining: missing - pending.length };
}

export function planAudio(tasks, languages, voices) {
  if (!Array.isArray(tasks)) throw new Error('tasks.json must contain an array.');
  const ids = new Set();
  return tasks.flatMap((task) => {
    if (!Number.isSafeInteger(task._id) || task._id < 0 || ids.has(task._id)) {
      throw new Error(`Invalid or duplicate _id: ${task._id}`);
    }
    ids.add(task._id);
    return languages.map((language) => {
      const text = task[language];
      if (typeof text !== 'string' || !text.trim()) {
        throw new Error(`Empty ${language} text for _id=${task._id}`);
      }
      if (!voices[language]?.trim()) throw new Error(`Missing voice for ${language}.`);
      const config = {
        model: 'tts-rt-v2',
        language,
        voice: voices[language],
        audio_format: 'aac',
        sample_rate: 24000,
        bitrate: 64000,
        text,
      };
      return { filename: `${language}_${task._id}.m4a`, config };
    });
  });
}

export async function requestSpeech(config, apiKey) {
  const response = await fetch('https://tts-rt.soniox.com/tts', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
    signal: AbortSignal.timeout(120_000),
  });
  if (!response.ok) {
    // Never log headers or the key. No automatic retries: failed requests may be billable.
    let details = {};
    try {
      details = await response.json();
    } catch {
      // Some infrastructure errors have no JSON body.
    }
    throw new Error(
      `Soniox HTTP ${response.status}: ${details.error_type ?? 'request failed'}` +
        (details.request_id ? ` (request_id=${details.request_id})` : ''),
    );
  }
  const contentType = response.headers.get('content-type')?.split(';')[0].trim().toLowerCase();
  // Soniox also serves AAC in an MP4 container as generic binary.
  if (!contentType?.startsWith('audio/') && contentType !== 'application/octet-stream') {
    throw new Error(
      `Soniox returned a non-audio response (HTTP ${response.status}, Content-Type: ${contentType ?? 'missing'}).`,
    );
  }
  const audio = Buffer.from(await response.arrayBuffer());
  if (audio.length === 0) throw new Error('Soniox returned empty audio.');
  return audio;
}

export async function generateAudio({
  jobs,
  outputDirectory,
  apiKey,
  request = requestSpeech,
  limit = Infinity,
  dryRun = false,
}) {
  const { pending, skipped, remaining } = await pendingAudio(
    jobs.map((job) => ({ ...job, outputDirectory: job.outputDirectory ?? outputDirectory })),
    limit,
  );
  console.log(`Existing: ${skipped}; to create: ${pending.length}; beyond limit: ${remaining}.`);
  if (dryRun) {
    for (const job of pending) {
      console.log(
        `${join(job.outputDirectory, job.filename)} [${job.config.voice}]: ${job.config.text}`,
      );
    }
    return { created: 0, skipped, requests: 0 };
  }
  if (!pending.length) return { created: 0, skipped, requests: 0 };
  let requests = 0;
  for (const [index, job] of pending.entries()) {
    if (!apiKey) throw new Error('Set SONIOX_API_KEY in .env.soniox.local.');
    const data = await request(job.config, apiKey);
    requests++;
    const destination = join(job.outputDirectory, job.filename);
    await writeFile(`${destination}.tmp`, data);
    await rename(`${destination}.tmp`, destination);
    console.log(`[${index + 1}/${pending.length}] ${destination}: ready`);
  }
  console.log(
    `Done: ${pending.length} files created, ${skipped} existing, ${requests} API requests.`,
  );
  return { created: pending.length, skipped, requests };
}

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      'dry-run': { type: 'boolean', default: false },
      languages: { type: 'string', default: 'en,ru' },
      limit: { type: 'string' },
      all: { type: 'boolean', default: false },
    },
  });
  const languages = values.languages.split(',');
  if (
    languages.some((language) => !['en', 'ru'].includes(language)) ||
    new Set(languages).size !== languages.length
  ) {
    throw new Error('--languages must be en, ru, or en,ru.');
  }
  const limit = values.limit === undefined ? Infinity : Number(values.limit);
  if (values.limit !== undefined && (!Number.isSafeInteger(limit) || limit < 1)) {
    throw new Error('--limit must be a positive integer (number of output files).');
  }
  const voices = {
    en: process.env.SONIOX_VOICE_EN ?? 'Adrian',
    ru: process.env.SONIOX_VOICE_RU ?? 'Adrian',
  };
  const lessons = await selectLessons(translationsDirectory, positionals, values.all);
  const jobs = [];
  for (const lesson of lessons) {
    const tasks = JSON.parse(await readFile(lesson.tasksFile, 'utf8'));
    jobs.push(
      ...planAudio(tasks, languages, voices).map((job) => ({
        ...job,
        outputDirectory: dirname(lesson.tasksFile),
      })),
    );
  }
  console.log(`Lessons: ${lessons.length}`);
  console.log(`Files: ${jobs.length}`);
  console.log('AAC, 64 kbps, 24 kHz, M4A; model tts-rt-v2.');
  const apiKey = process.env.SONIOX_API_KEY?.trim();
  await generateAudio({ jobs, apiKey, limit, dryRun: values['dry-run'] });
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  main().catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  });
}
