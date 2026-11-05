import { Translation } from '@/types';
import { ArrowKey, SentenceSelection } from './navigation.ts';

const historySize = 4;
const lookahead = 4;

export class AudioPrediction {
  private history: SentenceSelection[] = [];
  private direction = 1;
  private horizontal = false;

  reset() {
    this.history = [];
    this.direction = 1;
    this.horizontal = false;
  }

  observe(
    selection: SentenceSelection,
    order: number[],
    key?: ArrowKey,
    sourceLanguage: SentenceSelection['column'] = 'ru',
  ) {
    const previous = this.history[this.history.length - 1];
    const same = previous?.idx === selection.idx && previous.column === selection.column;
    if (same && !key) return;
    this.horizontal = key === 'ArrowLeft' || key === 'ArrowRight';
    if (key) {
      this.direction = key === 'ArrowUp' || key === 'ArrowLeft' ? -1 : 1;
    } else if (previous && previous.idx !== selection.idx) {
      this.direction = Math.sign(order.indexOf(selection.idx) - order.indexOf(previous.idx)) || 1;
    } else if (previous && previous.column !== selection.column) {
      this.direction = selection.column === sourceLanguage ? -1 : 1;
    }
    // Replaying or clicking the same phrase does not change the learned pattern.
    if (same) return;
    this.history = [...this.history.slice(-(historySize - 1)), selection];
  }

  upcoming(
    translations: Translation[],
    order: number[],
    selected: SentenceSelection | null,
    sourceLanguage: SentenceSelection['column'],
    resetOnLessonEnd: boolean,
  ): string[] {
    if (!selected || !this.history.length) return [];
    const row = order.indexOf(selected.idx);
    if (row < 0) return [];

    const bothLanguages =
      this.horizontal || this.history.some((item) => item.column !== selected.column);
    const columns = bothLanguages
      ? ([sourceLanguage, sourceLanguage === 'ru' ? 'en' : 'ru'] as const)
      : [selected.column];
    const length = order.length * columns.length;
    const position = row * columns.length + columns.indexOf(selected.column);
    const currentAudio = translations[selected.idx]?.audio?.[selected.column];
    const result = new Set<string>();

    // Traverse at most one lap, skipping absent and duplicate recordings.
    for (let step = 1; step < length && result.size < lookahead; step++) {
      const next = position + this.direction * step;
      // A forward bilingual lap would restart with a new, unpredictable shuffle.
      if (bothLanguages && resetOnLessonEnd && next >= length) break;
      const wrapped = (next + length) % length;
      const idx = order[Math.floor(wrapped / columns.length)];
      const column = columns[wrapped % columns.length];
      const audio = translations[idx]?.audio?.[column];
      if (audio && audio !== currentAudio) result.add(audio);
    }
    return [...result];
  }
}
