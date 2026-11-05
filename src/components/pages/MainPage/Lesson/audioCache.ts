type Entry = {
  audio: HTMLAudioElement;
  status: 'loading' | 'ready' | 'failed';
  detach: () => void;
  timeout?: ReturnType<typeof setTimeout>;
};

const cacheSize = 12;
const concurrency = 2;
const preloadDelayMs = 100;
const preloadTimeoutMs = 10_000;

// Keep the actual media elements: playback can reuse even a partially loaded file.
export class AudioCache {
  private entries = new Map<string, Entry>();
  private loading = new Set<string>();
  private planned: string[] = [];
  private current: string | null = null;
  private timer?: ReturnType<typeof setTimeout>;

  get(url: string): HTMLAudioElement {
    let entry = this.entries.get(url);
    if (entry && (entry.status === 'failed' || entry.audio.error)) {
      this.remove(url, entry);
      entry = undefined;
    }
    entry ??= this.create(url);
    this.current = url;
    this.loading.delete(url);
    clearTimeout(entry.timeout);
    // Insertion order doubles as a small LRU cache for replay and backward steps.
    this.entries.delete(url);
    this.entries.set(url, entry);
    this.trim();
    this.schedule();
    return entry.audio;
  }

  preload(urls: string[]) {
    this.planned = [...new Set(urls)].slice(0, 4);
    for (const url of this.loading) {
      if (!this.planned.includes(url)) {
        const entry = this.entries.get(url);
        if (entry) this.remove(url, entry);
      }
    }
    this.schedule();
  }

  clear() {
    clearTimeout(this.timer);
    this.timer = undefined;
    this.planned = [];
    this.current = null;
    for (const [url, entry] of this.entries) this.remove(url, entry);
  }

  private create(url: string): Entry {
    const audio = new Audio(url);
    audio.preload = 'auto';
    const entry: Entry = { audio, status: 'loading', detach: () => {} };
    const finish = (status: Entry['status']) => {
      entry.status = status;
      entry.detach();
      clearTimeout(entry.timeout);
      this.loading.delete(url);
      this.schedule();
    };
    const ready = () => finish('ready');
    const failed = () => finish('failed');
    audio.addEventListener('canplaythrough', ready);
    audio.addEventListener('error', failed);
    entry.detach = () => {
      audio.removeEventListener('canplaythrough', ready);
      audio.removeEventListener('error', failed);
    };
    this.entries.set(url, entry);
    return entry;
  }

  private schedule() {
    clearTimeout(this.timer);
    // Coalesce rapid navigation; always start foreground playback first.
    this.timer = setTimeout(() => {
      this.timer = undefined;
      for (const url of this.planned) {
        if (this.loading.size >= concurrency) break;
        if (url === this.current || this.loading.has(url)) continue;
        const entry = this.entries.get(url) ?? this.create(url);
        if (entry.status !== 'loading') continue;
        this.loading.add(url);
        entry.timeout = setTimeout(() => {
          // A stalled request must not block the rest of the window indefinitely.
          entry.status = 'failed';
          this.release(entry);
          this.loading.delete(url);
          this.schedule();
        }, preloadTimeoutMs);
      }
      this.trim();
    }, preloadDelayMs);
  }

  private trim() {
    for (const [url, entry] of this.entries) {
      if (this.entries.size <= cacheSize) break;
      if (url !== this.current && !this.planned.includes(url)) this.remove(url, entry);
    }
  }

  private remove(url: string, entry: Entry) {
    this.entries.delete(url);
    this.loading.delete(url);
    this.release(entry);
  }

  private release(entry: Entry) {
    entry.detach();
    clearTimeout(entry.timeout);
    entry.audio.onended = null;
    entry.audio.onerror = null;
    entry.audio.pause();
    entry.audio.removeAttribute('src');
    entry.audio.load();
  }
}
