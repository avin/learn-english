export type SentenceSelection = { idx: number; column: 'ru' | 'en' };
export type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

export const getNextSentence = (
  order: number[],
  selected: SentenceSelection | null,
  key: ArrowKey,
  sourceLanguage: SentenceSelection['column'] = 'ru',
): SentenceSelection | null => {
  if (!order.length) return null;

  const targetLanguage = sourceLanguage === 'ru' ? 'en' : 'ru';
  const row = selected ? order.indexOf(selected.idx) : -1;
  if (!selected || row === -1) return { idx: order[0], column: sourceLanguage };

  const wrapRow = (value: number) => (value + order.length) % order.length;
  switch (key) {
    case 'ArrowUp':
      return { ...selected, idx: order[wrapRow(row - 1)] };
    case 'ArrowDown':
      return { ...selected, idx: order[wrapRow(row + 1)] };
    case 'ArrowLeft':
      return selected.column === targetLanguage
        ? { idx: selected.idx, column: sourceLanguage }
        : { idx: order[wrapRow(row - 1)], column: targetLanguage };
    case 'ArrowRight':
      return selected.column === sourceLanguage
        ? { idx: selected.idx, column: targetLanguage }
        : { idx: order[wrapRow(row + 1)], column: sourceLanguage };
  }
};
