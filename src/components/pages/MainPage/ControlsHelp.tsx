import React from 'react';
import { HiX } from 'react-icons/hi';
import cn from 'clsx';
import { useModalDialog } from '@/utils/useModalDialog.ts';

interface Props {
  onClose: () => void;
}

interface MediaBinding {
  label: string;
  hold?: boolean;
}

const actions: {
  label: string;
  keyboard: string[][];
  gamepad: string[];
  media: MediaBinding[];
}[] = [
  { label: 'Строка выше', keyboard: [['↑']], gamepad: ['↑'], media: [] },
  { label: 'Строка ниже', keyboard: [['↓']], gamepad: ['↓'], media: [] },
  { label: 'Предыдущая ячейка', keyboard: [['←']], gamepad: ['←'], media: [{ label: 'Пред.' }] },
  { label: 'Следующая ячейка', keyboard: [['→']], gamepad: ['→'], media: [{ label: 'След.' }] },
  {
    label: 'Повторить озвучку',
    keyboard: [['Пробел'], ['Enter']],
    gamepad: ['A', '✕'],
    media: [{ label: 'Play' }, { label: 'Pause' }],
  },
  {
    label: 'Переключиться между словарём и предложениями',
    keyboard: [['V']],
    gamepad: ['Select', 'Share'],
    media: [],
  },
  {
    label: 'Предыдущий урок',
    keyboard: [['Shift', '←']],
    gamepad: ['LB', 'L1'],
    media: [{ label: 'Пред.', hold: true }],
  },
  {
    label: 'Следующий урок',
    keyboard: [['Shift', '→']],
    gamepad: ['RB', 'R1'],
    media: [{ label: 'След.', hold: true }],
  },
  {
    label: 'Закрыть переводы, перемешать и начать сначала',
    keyboard: [['Esc']],
    gamepad: ['Start', 'Options'],
    media: [{ label: 'Play', hold: true }],
  },
];

const Keycap = ({ children, gamepad = false }: { children: string; gamepad?: boolean }) => {
  const Tag = gamepad ? 'span' : 'kbd';
  return (
    <Tag
      className={cn(
        'inline-flex h-7 min-w-7 items-center justify-center whitespace-nowrap border border-b-[3px] border-light-gray1 bg-white px-1.5 font-sans text-xs font-semibold leading-none text-dark-gray3 shadow-sm',
        gamepad ? 'rounded-full' : 'rounded',
      )}
    >
      {children}
    </Tag>
  );
};

const ControlsHelp = ({ onClose }: Props) => {
  const { dialogRef, ...dialogEvents } = useModalDialog();

  return (
    <dialog
      id="controls-help"
      ref={dialogRef}
      {...dialogEvents}
      onClose={onClose}
      aria-labelledby="controls-help-title"
      className="max-h-[90dvh] w-[min(94vw,980px)] max-w-none rounded-xl p-0 shadow-xl backdrop:bg-black/50"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-light-gray2 bg-white px-4 py-4 sm:px-6">
        <h2 id="controls-help-title" className="text-lg font-bold">
          Справка по управлению
        </h2>
        <button
          type="button"
          aria-label="Закрыть справку"
          className="rounded p-1 text-gray1 hover:bg-light-gray5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray1"
          onClick={() => dialogRef.current?.close()}
        >
          <HiX size={20} aria-hidden="true" />
        </button>
      </div>
      <div className="px-4 pb-4 sm:px-6 sm:pb-6">
        <table className="w-full table-fixed text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-light-gray2 text-xs text-gray1">
              <th scope="col" className="w-[28%] py-3 pr-2 font-semibold">
                Действие
              </th>
              <th scope="col" className="w-[26%] py-3 pr-2 font-semibold">
                Клавиатура
              </th>
              <th scope="col" className="w-[22%] py-3 pr-2 font-semibold">
                Геймпад
              </th>
              <th scope="col" className="w-[24%] py-3 font-semibold">
                <span className="sm:hidden">Медиа</span>
                <span className="hidden sm:inline">Медиаклавиши</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light-gray2">
            {actions.map(({ label, keyboard, gamepad, media }) => (
              <tr key={label}>
                <th
                  scope="row"
                  className="break-words py-3 pr-2 font-normal leading-snug text-dark-gray3"
                >
                  {label}
                </th>
                <td className="py-3 pr-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {keyboard.length ? (
                      keyboard.map((keys, index) => (
                        <React.Fragment key={keys.join('+')}>
                          {index > 0 && <span className="text-xs text-gray1">или</span>}
                          <span className="inline-flex flex-wrap items-center gap-1">
                            {keys.map((key, keyIndex) => (
                              <span key={key} className="inline-flex items-center gap-1">
                                {keyIndex > 0 && <span className="text-gray2">+</span>}
                                <Keycap>{key}</Keycap>
                              </span>
                            ))}
                          </span>
                        </React.Fragment>
                      ))
                    ) : (
                      <span aria-label="Нет сочетания клавиш" className="text-gray2">
                        —
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 pr-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {gamepad.map((button, index) => (
                      <React.Fragment key={button}>
                        {index > 0 && <span className="text-xs text-gray1">/</span>}
                        <Keycap gamepad>{button}</Keycap>
                      </React.Fragment>
                    ))}
                  </div>
                </td>
                <td className="py-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {media.length ? (
                      media.map((binding, index) => (
                        <React.Fragment key={`${binding.hold ? 'hold' : 'tap'}-${binding.label}`}>
                          {index > 0 && <span className="text-xs text-gray1">или</span>}
                          <span className="inline-flex flex-wrap items-center gap-1">
                            {binding.hold && <span className="text-xs text-gray1">удержание</span>}
                            <Keycap>{binding.label}</Keycap>
                          </span>
                        </React.Fragment>
                      ))
                    ) : (
                      <span aria-label="Нет медиаклавиши" className="text-gray2">
                        —
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </dialog>
  );
};

export default ControlsHelp;
