export type SentenceSelection = { idx: number; column: 'ru' | 'en' };
export type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

export const getNextSentence = (
  order: number[],
  selected: SentenceSelection | null,
  key: ArrowKey,
): SentenceSelection | null => {
  if (!order.length) return null;

  const row = selected ? order.indexOf(selected.idx) : -1;
  if (!selected || row === -1) return { idx: order[0], column: 'ru' };

  const wrapRow = (value: number) => (value + order.length) % order.length;
  switch (key) {
    case 'ArrowUp':
      return { ...selected, idx: order[wrapRow(row - 1)] };
    case 'ArrowDown':
      return { ...selected, idx: order[wrapRow(row + 1)] };
    case 'ArrowLeft':
      return selected.column === 'en'
        ? { idx: selected.idx, column: 'ru' }
        : { idx: order[wrapRow(row - 1)], column: 'en' };
    case 'ArrowRight':
      return selected.column === 'ru'
        ? { idx: selected.idx, column: 'en' }
        : { idx: order[wrapRow(row + 1)], column: 'ru' };
  }
};
