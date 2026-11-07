import React, { PointerEvent, RefObject, useEffect, useRef, useState } from 'react';
import cn from 'clsx';
import Button from '@/components/common/Button/Button.tsx';
import { Translation } from '@/types';
import { ArrowKey, SentenceSelection } from './navigation.ts';

interface Props {
  dialogRef: RefObject<HTMLDialogElement>;
  phrase: Translation | null;
  sourceLanguage: SentenceSelection['column'];
  revealed: boolean;
  onArrow: (key: ArrowKey) => void;
  onReveal: () => void;
  onClose: () => void;
  onRetryAudio?: () => void;
}

const MobileLesson = ({
  dialogRef,
  phrase,
  sourceLanguage,
  revealed,
  onArrow,
  onReveal,
  onClose,
  onRetryAudio,
}: Props) => {
  const start = useRef<{ id: number; x: number; y: number } | null>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [holdingExit, setHoldingExit] = useState(false);
  useEffect(
    () => () => {
      if (exitTimer.current !== null) clearTimeout(exitTimer.current);
    },
    [],
  );
  const targetLanguage = sourceLanguage === 'ru' ? 'en' : 'ru';
  const previous = useRef({ phrase, revealed });
  const direction = useRef<'forward' | 'backward'>('forward');
  const [transition, setTransition] = useState<{
    id: number;
    direction: 'forward' | 'backward';
    outgoing: { phrase: Translation; revealed: boolean } | null;
  }>({ id: 0, direction: 'forward', outgoing: null });

  if (previous.current.phrase !== phrase) {
    const outgoing = previous.current.phrase
      ? { phrase: previous.current.phrase, revealed: previous.current.revealed }
      : null;
    previous.current = { phrase, revealed };
    setTransition({
      id: transition.id + 1,
      direction: direction.current,
      outgoing: phrase ? outgoing : null,
    });
  } else {
    previous.current.revealed = revealed;
  }

  const renderPhrase = (item: Translation, isRevealed: boolean) => (
    <>
      <span lang={sourceLanguage}>{item[sourceLanguage]}</span>
      <span className="relative block text-blue1">
        <span lang={targetLanguage} aria-hidden={!isRevealed}>
          {item[targetLanguage]}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-0 rounded-sm bg-gray5',
            isRevealed && 'opacity-0 transition-opacity',
          )}
        />
      </span>
    </>
  );

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    start.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleArrow = (key: ArrowKey) => {
    if (key === 'ArrowRight') direction.current = 'forward';
    if (key === 'ArrowLeft') direction.current = 'backward';
    onArrow(key);
  };

  const onPointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    if (start.current?.id !== event.pointerId) return;
    const dx = event.clientX - start.current.x;
    const dy = event.clientY - start.current.y;
    start.current = null;
    const horizontal = Math.abs(dx) > Math.abs(dy);
    if (Math.abs(horizontal ? dx : dy) < 24) onReveal();
    else if (horizontal) handleArrow(dx < 0 ? 'ArrowRight' : 'ArrowLeft');
    else handleArrow(dy < 0 ? 'ArrowUp' : 'ArrowDown');
  };

  const cancelExit = () => {
    if (exitTimer.current !== null) clearTimeout(exitTimer.current);
    exitTimer.current = null;
    setHoldingExit(false);
  };

  const holdExit = () => {
    if (exitTimer.current !== null) return;
    setHoldingExit(true);
    exitTimer.current = setTimeout(() => {
      exitTimer.current = null;
      setHoldingExit(false);
      dialogRef.current?.close();
    }, 500);
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label="TV-режим"
      onClose={() => {
        cancelExit();
        onClose();
      }}
      className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-hidden overscroll-none bg-white p-0"
    >
      <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
        <Button
          intent="outline"
          className="relative min-h-11 touch-none select-none overflow-hidden"
          aria-label="Удерживайте, чтобы выйти"
          onPointerDown={(event) => {
            if (!event.isPrimary || event.button !== 0) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            holdExit();
          }}
          onPointerMove={(event) => {
            if (!holdingExit) return;
            const rect = event.currentTarget.getBoundingClientRect();
            if (
              event.clientX < rect.left ||
              event.clientX > rect.right ||
              event.clientY < rect.top ||
              event.clientY > rect.bottom
            )
              cancelExit();
          }}
          onPointerUp={cancelExit}
          onPointerCancel={cancelExit}
          onLostPointerCapture={cancelExit}
          onBlur={cancelExit}
          onContextMenu={(event) => event.preventDefault()}
          onKeyDown={(event) => {
            if (event.key === ' ' || event.key === 'Enter') {
              event.preventDefault();
              holdExit();
            }
          }}
          onKeyUp={(event) => {
            if (event.key === ' ' || event.key === 'Enter') cancelExit();
          }}
        >
          {holdingExit && (
            <span
              aria-hidden="true"
              className="mobile-exit-progress absolute inset-0 origin-left bg-blue2/25"
            />
          )}
          <span className="relative">Выйти</span>
        </Button>
        {onRetryAudio && (
          <Button intent="outline" className="min-h-11 touch-manipulation" onClick={onRetryAudio}>
            Включить звук
          </Button>
        )}
      </div>
      {phrase && (
        <button
          type="button"
          className="flex h-full w-full touch-none select-none items-center justify-center px-5 py-16 text-center focus-visible:outline focus-visible:-outline-offset-4 focus-visible:outline-blue2"
          aria-describedby="mobile-lesson-help"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onLostPointerCapture={(event) => {
            if (start.current?.id === event.pointerId) start.current = null;
          }}
          onClick={(event) => {
            if (event.detail === 0) onReveal();
          }}
          onKeyDown={(event) => {
            const key = event.key;
            if (
              key !== 'ArrowLeft' &&
              key !== 'ArrowRight' &&
              key !== 'ArrowUp' &&
              key !== 'ArrowDown'
            )
              return;
            event.preventDefault();
            if (!event.repeat) handleArrow(key);
          }}
        >
          <span
            className={cn(
              'relative block w-full max-w-2xl text-xl leading-snug sm:text-3xl',
              transition.direction === 'backward' && 'mobile-phrase-reverse',
            )}
          >
            {transition.outgoing && (
              <span
                key={`out-${transition.id}`}
                aria-hidden="true"
                className="mobile-phrase-out absolute inset-0 flex flex-col justify-center gap-6 break-words"
                onAnimationEnd={() => setTransition((current) => ({ ...current, outgoing: null }))}
              >
                {renderPhrase(transition.outgoing.phrase, transition.outgoing.revealed)}
              </span>
            )}
            <span
              key={transition.id}
              className={cn(
                'flex flex-col gap-6 break-words',
                transition.outgoing && 'mobile-phrase-in',
              )}
            >
              {renderPhrase(phrase, revealed)}
            </span>
            <span className="sr-only">{revealed ? 'Повторить перевод' : 'Показать перевод'}</span>
          </span>
        </button>
      )}
      <p id="mobile-lesson-help" className="sr-only">
        Стрелки влево и вправо переключают предложения. Стрелка вверх повторяет исходную фразу,
        стрелка вниз повторяет перевод.
      </p>
    </dialog>
  );
};

export default MobileLesson;
