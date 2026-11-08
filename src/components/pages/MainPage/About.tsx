import React from 'react';
import { HiX } from 'react-icons/hi';
import { useModalDialog } from '@/utils/useModalDialog.ts';

const About = ({ onClose }: { onClose: () => void }) => {
  const { dialogRef, ...dialogEvents } = useModalDialog();

  return (
    <dialog
      ref={dialogRef}
      {...dialogEvents}
      onClose={onClose}
      aria-labelledby="about-title"
      className="max-h-[90dvh] w-[min(94vw,520px)] max-w-none rounded-xl p-0 shadow-xl backdrop:bg-black/50"
    >
      <div className="flex items-center justify-between gap-4 border-b border-light-gray2 bg-white px-4 py-4 sm:px-6">
        <h2 id="about-title" className="text-lg font-bold">
          О тренажёре
        </h2>
        <button
          type="button"
          aria-label="Закрыть"
          className="rounded p-1 text-gray1 hover:bg-light-gray5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray1"
          onClick={() => dialogRef.current?.close()}
        >
          <HiX size={20} aria-hidden="true" />
        </button>
      </div>
      <div className="space-y-4 px-4 py-4 text-sm sm:px-6 sm:py-6">
        <p>
          Тренажёр создан по курсам{' '}
          <a
            className="text-blue1 underline"
            href="https://www.youtube.com/@englishplaylists/playlists"
            target="_blank"
            rel="noreferrer"
          >
            «Английский по плейлистам»
          </a>
          .
        </p>
        <p>
          <a
            className="text-blue1 underline"
            href="https://github.com/avin/learn-english/releases"
            target="_blank"
            rel="noreferrer"
          >
            Скачать приложение для работы без интернета
          </a>
        </p>
      </div>
    </dialog>
  );
};

export default About;
