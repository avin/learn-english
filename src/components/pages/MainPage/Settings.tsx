import React from 'react';
import { HiCheck, HiX } from 'react-icons/hi';
import { AppSettings, cursorScrollDurationOptions, cursorZoneOptions } from '@/utils/settings.ts';
import { useModalDialog } from '@/utils/useModalDialog.ts';

interface Props {
  settings: AppSettings;
  onChange: (settings: AppSettings) => void;
  onClose: () => void;
}

const Settings = ({ settings, onChange, onClose }: Props) => {
  const { dialogRef, ...dialogEvents } = useModalDialog();

  return (
    <dialog
      ref={dialogRef}
      {...dialogEvents}
      onClose={onClose}
      aria-labelledby="settings-title"
      className="w-[min(90vw,480px)] rounded-lg p-6 shadow-lg backdrop:bg-black/50"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 id="settings-title" className="text-lg font-bold">
          Настройки
        </h2>
        <button
          type="button"
          aria-label="Закрыть настройки"
          className="rounded p-1 text-gray1 hover:bg-light-gray5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray1"
          onClick={() => dialogRef.current?.close()}
        >
          <HiX size={20} aria-hidden="true" />
        </button>
      </div>
      <div className="space-y-4">
        <label className="flex cursor-pointer items-start gap-3">
          <span className="relative mt-1 flex h-4 w-4 shrink-0">
            <input
              type="checkbox"
              className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray3 bg-white checked:border-gray1 checked:bg-gray1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray1"
              checked={settings.autoPlayOnReveal}
              onChange={(event) =>
                onChange({ ...settings, autoPlayOnReveal: event.target.checked })
              }
            />
            <HiCheck
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden h-4 w-4 text-white peer-checked:block"
            />
          </span>
          <span>Автоматически зачитывать предложение после раскрытия</span>
        </label>
        <label className="flex cursor-pointer items-start gap-3">
          <span className="relative mt-1 flex h-4 w-4 shrink-0">
            <input
              type="checkbox"
              className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray3 bg-white checked:border-gray1 checked:bg-gray1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray1"
              checked={settings.showAudioUnderline}
              onChange={(event) =>
                onChange({ ...settings, showAudioUnderline: event.target.checked })
              }
            />
            <HiCheck
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden h-4 w-4 text-white peer-checked:block"
            />
          </span>
          <span>Показывать пунктиром предложения с озвучкой</span>
        </label>
      </div>
      <section aria-labelledby="keyboard-settings-title" className="mt-6">
        <h3 id="keyboard-settings-title" className="mb-4 font-semibold">
          Управление с клавиатуры и геймпада
        </h3>
        <div className="space-y-4">
          <label className="flex cursor-pointer items-start gap-3">
            <span className="relative mt-1 flex h-4 w-4 shrink-0">
              <input
                type="checkbox"
                className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray3 bg-white checked:border-gray1 checked:bg-gray1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray1"
                checked={settings.gamepadEnabled}
                onChange={(event) =>
                  onChange({ ...settings, gamepadEnabled: event.target.checked })
                }
              />
              <HiCheck
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 hidden h-4 w-4 text-white peer-checked:block"
              />
            </span>
            <span>Включить управление с геймпада</span>
          </label>
          <label className="flex cursor-pointer items-start gap-3">
            <span className="relative mt-1 flex h-4 w-4 shrink-0">
              <input
                type="checkbox"
                className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray3 bg-white checked:border-gray1 checked:bg-gray1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray1"
                checked={settings.resetOnLessonEnd}
                onChange={(event) =>
                  onChange({ ...settings, resetOnLessonEnd: event.target.checked })
                }
              />
              <HiCheck
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 hidden h-4 w-4 text-white peer-checked:block"
              />
            </span>
            <span>Автоматически закрывать все и перемешивать по достижении конца урока</span>
          </label>
          <div>
            <label htmlFor="cursor-zone-percent" className="mb-2 block">
              Размер центральной зоны
            </label>
            <select
              id="cursor-zone-percent"
              className="w-full appearance-auto rounded border border-gray3 bg-white px-3 py-2"
              value={settings.cursorZonePercent}
              onChange={(event) =>
                onChange({ ...settings, cursorZonePercent: Number(event.target.value) })
              }
              aria-describedby="cursor-zone-description"
            >
              {cursorZoneOptions.map((value) => (
                <option key={value} value={value}>
                  {value}%
                </option>
              ))}
            </select>
            <p id="cursor-zone-description" className="mt-2 text-sm text-gray1">
              Пока курсор в этой области по центру экрана, страница не прокручивается.
            </p>
          </div>
          <div>
            <label htmlFor="cursor-scroll-duration" className="mb-2 block">
              Длительность прокрутки
            </label>
            <select
              id="cursor-scroll-duration"
              className="w-full appearance-auto rounded border border-gray3 bg-white px-3 py-2"
              value={settings.cursorScrollDurationMs}
              onChange={(event) =>
                onChange({ ...settings, cursorScrollDurationMs: Number(event.target.value) })
              }
              aria-describedby="cursor-scroll-description"
            >
              {cursorScrollDurationOptions.map((value) => (
                <option key={value} value={value}>
                  {value} мс
                </option>
              ))}
            </select>
            <p id="cursor-scroll-description" className="mt-2 text-sm text-gray1">
              Чем больше значение, тем медленнее прокрутка.
            </p>
          </div>
        </div>
      </section>
    </dialog>
  );
};

export default Settings;
