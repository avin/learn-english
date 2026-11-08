import React, {
  CSSProperties,
  PointerEvent,
  RefObject,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import cn from 'clsx';
import Button from '@/components/common/Button/Button.tsx';
import { Translation } from '@/types';
import { GamepadAction } from '@/utils/gamepad.ts';
import { ArrowKey, SentenceSelection } from './navigation.ts';

export type SlideDirection = 'forward' | 'backward';

export interface MobileLessonControls {
  handleGamepad: (action: GamepadAction) => boolean;
  prepareTransition: (direction: SlideDirection) => void;
}

interface Props {
  lessonTitle: string;
  dialogRef: RefObject<HTMLDialogElement>;
  controlsRef: RefObject<MobileLessonControls>;
  phrase: Translation | null;
  sourceLanguage: SentenceSelection['column'];
  revealed: boolean;
  onArrow: (key: ArrowKey) => void;
  onSwipe: (key: ArrowKey) => void;
  onReplay: () => void;
  onRestart: () => void;
  onToggleDictionary: () => void;
  onAdjacentLesson?: (direction: number) => void;
  onReady?: () => void;
  onReveal: () => void;
  onClose: () => void;
  onRetryAudio?: () => void;
}

const getScreenAngle = () =>
  globalThis.screen?.orientation?.angle ?? globalThis.window?.orientation;

const MobileLesson = ({
  lessonTitle,
  dialogRef,
  controlsRef,
  phrase,
  sourceLanguage,
  revealed,
  onArrow,
  onSwipe,
  onReplay,
  onRestart,
  onToggleDictionary,
  onAdjacentLesson,
  onReady,
  onReveal,
  onClose,
  onRetryAudio,
}: Props) => {
  const start = useRef<{ id: number; x: number; y: number; angle: number | undefined } | null>(
    null,
  );
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const readyExitPointer = useRef<number | null>(null);
  const [holdingExit, setHoldingExit] = useState(false);
  const phraseButton = useRef<HTMLButtonElement>(null);
  const hasPhrase = phrase !== null;
  useEffect(() => {
    if (hasPhrase) phraseButton.current?.focus();
  }, [hasPhrase]);
  useEffect(
    () => () => {
      if (exitTimer.current !== null) clearTimeout(exitTimer.current);
    },
    [],
  );
  const targetLanguage = sourceLanguage === 'ru' ? 'en' : 'ru';
  const previous = useRef({ phrase, revealed });
  const incoming = useRef<HTMLSpanElement>(null);
  const motion = useRef({ direction: 'forward' as SlideDirection, offset: 0 });
  const [transition, setTransition] = useState<{
    id: number;
    direction: SlideDirection;
    offset: number;
    outgoing: { phrase: Translation; revealed: boolean } | null;
  }>({ id: 0, ...motion.current, outgoing: null });

  if (previous.current.phrase !== phrase) {
    const outgoing = previous.current.phrase
      ? { phrase: previous.current.phrase, revealed: previous.current.revealed }
      : null;
    previous.current = { phrase, revealed };
    setTransition({
      id: transition.id + 1,
      ...motion.current,
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
    start.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      angle: getScreenAngle(),
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  useImperativeHandle(controlsRef, () => ({
    prepareTransition(direction) {
      const item = incoming.current;
      const offset =
        transition.outgoing && item?.parentElement
          ? item.getBoundingClientRect().left - item.parentElement.getBoundingClientRect().left
          : 0;
      motion.current = { direction, offset };
    },
    handleGamepad(action) {
      const dialog = dialogRef.current;
      if (!dialog?.open) return false;
      switch (action) {
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'ArrowUp':
        case 'ArrowDown':
          onArrow(action);
          break;
        case 'replay':
          onReplay();
          break;
        case 'restart':
          onRestart();
          break;
        case 'toggleDictionary':
          onToggleDictionary();
          break;
        case 'previousLesson':
        case 'nextLesson':
          onAdjacentLesson?.(action === 'nextLesson' ? 1 : -1);
          break;
      }
      return true;
    },
  }));

  const onPointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    const gesture = start.current;
    if (gesture?.id !== event.pointerId) return;
    start.current = null;
    // Pointer coordinates follow the viewport, so a rotation invalidates the starting point.
    if (gesture.angle !== getScreenAngle()) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    const horizontal = Math.abs(dx) > Math.abs(dy);
    if (Math.abs(horizontal ? dx : dy) < 24) onReveal();
    else if (horizontal) onSwipe(dx < 0 ? 'ArrowRight' : 'ArrowLeft');
    else onSwipe(dy < 0 ? 'ArrowDown' : 'ArrowUp');
  };

  const cancelExit = () => {
    if (exitTimer.current !== null) clearTimeout(exitTimer.current);
    exitTimer.current = null;
    readyExitPointer.current = null;
    setHoldingExit(false);
  };

  const holdExit = (touchPointerId?: number) => {
    if (exitTimer.current !== null || readyExitPointer.current !== null) return;
    setHoldingExit(true);
    exitTimer.current = setTimeout(() => {
      exitTimer.current = null;
      // Keep the lesson covered until the touch ends so the browser cannot select its text.
      if (touchPointerId !== undefined) {
        readyExitPointer.current = touchPointerId;
        return;
      }
      setHoldingExit(false);
      dialogRef.current?.close();
    }, 300);
  };

  useLayoutEffect(() => {
    onReady?.();
  }, [onReady]);

  return (
    <dialog
      ref={dialogRef}
      data-gamepad=""
      aria-label="TV-режим"
      onKeyDown={(event) => {
        const { key } = event;
        if (
          event.defaultPrevented ||
          event.altKey ||
          event.ctrlKey ||
          event.metaKey ||
          event.nativeEvent?.isComposing
        )
          return;
        if (event.shiftKey) {
          if (key === 'ArrowLeft' || key === 'ArrowRight') {
            event.preventDefault();
            if (!event.repeat) onAdjacentLesson?.(key === 'ArrowRight' ? 1 : -1);
          }
          return;
        }
        const action =
          event.code === 'KeyV'
            ? onToggleDictionary
            : key === 'Escape'
              ? onRestart
              : (key === ' ' || key === 'Enter') && event.target === phraseButton.current
                ? onReplay
                : null;
        if (action) {
          event.preventDefault();
          if (!event.repeat) action();
          return;
        }
        if (key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'ArrowUp' && key !== 'ArrowDown')
          return;
        event.preventDefault();
        onArrow(key);
      }}
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
            holdExit(event.pointerType === 'touch' ? event.pointerId : undefined);
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
          onPointerUp={(event) => {
            const shouldClose = readyExitPointer.current === event.pointerId;
            cancelExit();
            if (shouldClose) dialogRef.current?.close();
          }}
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
      <p className="pointer-events-none absolute right-5 top-4 m-0 text-sm text-gray3">
        {lessonTitle}
      </p>
      {phrase && (
        <button
          ref={phraseButton}
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
        >
          <span
            style={{ '--phrase-start': `${transition.offset}px` } as CSSProperties}
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
              ref={incoming}
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
        Стрелка вправо сначала показывает перевод, затем переключает на следующую фразу. Стрелка
        влево идёт в обратном порядке, включая переводы. Стрелки вверх и вниз переходят между
        строками на том же языке.
      </p>
    </dialog>
  );
};

export default MobileLesson;
