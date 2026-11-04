import React, { useEffect, useRef } from 'react';
import { HiCheck } from 'react-icons/hi';
import Button from '@/components/common/Button/Button.tsx';
import { AppSettings } from '@/utils/settings.ts';

interface Props {
  settings: AppSettings;
  onChange: (settings: AppSettings) => void;
  onClose: () => void;
}

const Settings = ({ settings, onChange, onClose }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="settings-title"
      className="w-[min(90vw,480px)] rounded-lg p-6 shadow-lg backdrop:bg-black/50"
    >
      <h2 id="settings-title" className="mb-5 text-lg font-bold">
        Настройки
      </h2>
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
      <div className="mt-6 flex justify-end">
        <Button intent="outline" onClick={() => dialogRef.current?.close()}>
          Закрыть
        </Button>
      </div>
    </dialog>
  );
};

export default Settings;
