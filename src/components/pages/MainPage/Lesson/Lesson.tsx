import React, { useCallback, useEffect, useRef, useState } from 'react';
import { HiOutlineStar, HiStar } from 'react-icons/hi';
import { usePrevious } from 'react-use';
import cn from 'clsx';
import { shuffle } from 'lodash-es';
import Button from '@/components/common/Button/Button.tsx';
import FullPageSpinner from '@/components/common/FullPageSpinner/FullPageSpinner.tsx';
import { Course, Translation, TranslationTask } from '@/types';
import { AppSettings } from '@/utils/settings.ts';
import {
  loadFavoriteTranslations,
  loadLastOpenSentences,
  saveFavoriteTranslations,
  saveLastOpenSentences,
} from '@/utils/storage.ts';
import { ArrowKey, SentenceSelection, getNextSentence } from './navigation.ts';

interface Props {
  course: Course;
  lesson: string;
  settings: AppSettings;
}

const Lesson = ({ course, lesson, settings }: Props) => {
  const [translations, setTranslations] = useState<Translation[] | null>(null);
  const [order, setOrder] = useState<number[]>([]);
  const [openSentences, setOpenSentences] = useState<number[] | null>(null);
  const prevOpenSentences = usePrevious(openSentences);
  const [favoriteTranslations, setFavoriteTranslations] = useState<Translation[] | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [selected, setSelected] = useState<SentenceSelection | null>(null);
  const [keyboardMode, setKeyboardMode] = useState(false);
  const selectedSentenceRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [course, lesson]);

  const playAudio = useCallback((path: string) => {
    const relativePath = path.replace(/^\/src\/assets\//, '');
    const url = `${import.meta.env.BASE_URL}${relativePath}`;

    audioRef.current?.pause();
    const audio = new Audio(url);
    audioRef.current = audio;
    void audio.play().catch((error: unknown) => {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
      console.error('Error playing phrase audio:', error);
    });
  }, []);

  useEffect(() => {
    const handlePointerDown = () => setKeyboardMode(false);
    document.addEventListener('pointerdown', handlePointerDown, true);
    return () => document.removeEventListener('pointerdown', handlePointerDown, true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isReplay = event.key === ' ' || event.key === 'Enter';
      if (
        (!isReplay && !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.defaultPrevented ||
        !translations ||
        !openSentences ||
        !favoriteTranslations ||
        document.querySelector('dialog[open]')
      )
        return;

      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.closest('input, textarea, select, [role="combobox"], [role="slider"]'))
      )
        return;

      if (isReplay) {
        if (
          !selected ||
          (target instanceof HTMLElement &&
            target.closest('button, a, [role="button"]') &&
            !target.closest('[data-sentence]'))
        )
          return;

        event.preventDefault();
        if (event.repeat) return;
        setKeyboardMode(true);
        const audio = translations[selected.idx].audio?.[selected.column];
        if (audio) playAudio(audio);
        return;
      }

      const next = getNextSentence(order, selected, event.key as ArrowKey);
      if (!next) return;
      event.preventDefault();
      setSelected(next);
      setKeyboardMode(true);
      if (next.column === 'en') {
        setOpenSentences((current) =>
          current?.includes(next.idx) ? current : [...(current || []), next.idx],
        );
      }
      const audio = translations[next.idx].audio?.[next.column];
      if (audio) playAudio(audio);
      else audioRef.current?.pause();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [favoriteTranslations, openSentences, order, playAudio, selected, translations]);

  useEffect(() => {
    const sentence = selectedSentenceRef.current;
    if (keyboardMode && sentence && !document.querySelector('dialog[open]')) {
      const { top, height } = sentence.getBoundingClientRect();
      const center = top + height / 2;
      const viewportHeight = window.innerHeight;
      const zonePercent = settings.cursorZonePercent === 0 ? 2 : settings.cursorZonePercent;
      const halfZone = (viewportHeight * zonePercent) / 200;
      if (Math.abs(center - viewportHeight / 2) <= halfZone) return;

      const start = window.scrollY;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - viewportHeight);
      const target = Math.min(maxScroll, Math.max(0, start + center - viewportHeight / 2));
      if (target === start) return;

      const startedAt = performance.now();
      let frame: number;
      const animate = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / settings.cursorScrollDurationMs);
        const easedProgress = (1 - Math.cos(Math.PI * progress)) / 2;
        window.scrollTo({ top: start + (target - start) * easedProgress, behavior: 'instant' });
        if (progress < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);

      const cancel = () => cancelAnimationFrame(frame);
      window.addEventListener('wheel', cancel, { passive: true });
      window.addEventListener('touchstart', cancel, { passive: true });
      return () => {
        cancel();
        window.removeEventListener('wheel', cancel);
        window.removeEventListener('touchstart', cancel);
      };
    }
  }, [keyboardMode, selected, settings.cursorZonePercent, settings.cursorScrollDurationMs]);

  useEffect(() => {
    setOpenSentences(null);
    void loadLastOpenSentences(course, lesson).then((sentences) => {
      setOpenSentences(sentences);
    });
  }, [course, lesson]);

  useEffect(() => {
    void loadFavoriteTranslations().then((favoriteTranslations) => {
      setFavoriteTranslations(favoriteTranslations);
    });
  }, []);

  const addRemoveFromFavoriteTranslations = (translation: Translation) => {
    if (course === 'favorites') {
      const removedIdx = translations?.indexOf(translation);
      if (removedIdx !== undefined && removedIdx !== -1) {
        const row = order.indexOf(removedIdx);
        const remaining = order.filter((idx) => idx !== removedIdx);
        setOrder(remaining);
        if (selected?.idx === removedIdx) {
          setSelected(
            remaining.length ? { idx: remaining[row % remaining.length], column: 'ru' } : null,
          );
        }
      }
    }
    setFavoriteTranslations((v) => {
      if (!v) {
        return v;
      }
      const result = (() => {
        const existingItem = v.find((i) => i.ru === translation.ru && i.en === translation.en);
        if (existingItem) {
          return v.filter((i) => i !== existingItem);
        } else {
          return [...v, translation];
        }
      })();

      void saveFavoriteTranslations(result);
      return result;
    });
  };

  useEffect(() => {
    let active = true;
    void (async () => {
      setTranslations(null);

      const newTranslations = await (async () => {
        if (course === 'favorites') {
          return loadFavoriteTranslations();
        } else {
          const lessonPath = `translations/${encodeURIComponent(course)}/${encodeURIComponent(lesson)}`;
          const response = await fetch(`${import.meta.env.BASE_URL}${lessonPath}/tasks.json`);
          if (!response.ok) {
            throw new Error(`Failed to load translations: ${response.status}`);
          }
          const tasks: TranslationTask[] = await response.json();
          return tasks.map(({ id, ru, en }) => {
            const audio: Translation['audio'] = {};
            const audioPath = `${lessonPath}/audio/${String(id).padStart(3, '0')}`;
            if (ru.audio) {
              audio.ru = `${audioPath}_ru.m4a`;
            }
            if (en.audio) {
              audio.en = `${audioPath}_en.m4a`;
            }
            return { ru: ru.text, en: en.text, audio };
          });
        }
      })();
      if (active) {
        setTranslations(newTranslations);
        setOrder(new Array(newTranslations.length).fill(0).map((_, idx) => idx));
      }
    })();
    return () => {
      active = false;
    };
  }, [course, lesson]);

  const handleClickEnSentence = (idx: number) => {
    const audio = translations?.[idx]?.audio?.en;
    if (settings.autoPlayOnReveal && audio && !openSentences?.includes(idx)) {
      playAudio(audio);
    }
    setOpenSentences((v) => {
      if (!v) {
        return v;
      }
      return v.includes(idx) ? v : [...v, idx];
    });
  };

  useEffect(() => {
    if (
      openSentences &&
      prevOpenSentences &&
      openSentences !== prevOpenSentences &&
      course !== 'favorites'
    ) {
      void saveLastOpenSentences(course, lesson, openSentences);
    }
  }, [course, lesson, openSentences, prevOpenSentences]);

  const handleClickCloseAll = () => {
    setOpenSentences([]);
  };

  const handleClickOpenAll = () => {
    setOpenSentences(new Array(translations?.length).fill(0).map((_, idx) => idx));
  };

  const handleClickShuffle = () => {
    setOrder((v) => shuffle(v));
    setSelected(null);
    setKeyboardMode(false);
  };

  if (!translations || !openSentences || !favoriteTranslations) {
    return <FullPageSpinner />;
  }

  if (!order.length) {
    return null;
  }

  const controls = (
    <div className="flex justify-center space-x-2">
      <Button onClick={handleClickShuffle} intent="warning">
        Перемешать
      </Button>
      <Button onClick={handleClickOpenAll} intent="primary">
        Открыть все
      </Button>
      <Button onClick={handleClickCloseAll} intent="danger">
        Закрыть все
      </Button>
    </div>
  );

  return (
    <div className="fade-in">
      {controls}
      <div className="mx-auto my-8 max-w-[800px] overflow-hidden rounded-lg border border-gray3">
        <table className="w-full">
          <tbody className="divide-y divide-gray5 bg-white">
            {order.map((idx) => {
              const translation = translations[idx];
              const { ru, en, audio } = translation;
              const ruAudio = audio?.ru;
              const enAudio = audio?.en;

              const isOpen = openSentences.includes(idx);
              const isFavorite = favoriteTranslations.find((i) => i.ru === ru && i.en === en);
              return (
                <tr
                  key={`${course}_${lesson}_${idx}`}
                  className="w-[50%] bg-white hover:bg-light-gray5"
                >
                  <td
                    className="w-[1px] cursor-pointer px-2"
                    onClick={() => {
                      addRemoveFromFavoriteTranslations(translation);
                    }}
                  >
                    {isFavorite ? (
                      <HiStar size={24} className="text-orange5 opacity-50" />
                    ) : (
                      <HiOutlineStar size={24} className="text-light-gray3" />
                    )}
                  </td>
                  <td className="p-4 text-right align-top">
                    <div
                      data-sentence="ru"
                      ref={
                        selected?.idx === idx && selected.column === 'ru'
                          ? selectedSentenceRef
                          : null
                      }
                      className={cn('sentence', {
                        'sentence-selected':
                          keyboardMode && selected?.idx === idx && selected.column === 'ru',
                      })}
                      onClick={() => setSelected({ idx, column: 'ru' })}
                    >
                      {ruAudio ? (
                        <button
                          type="button"
                          className="text-right"
                          onClick={() => playAudio(ruAudio)}
                        >
                          <span className={cn({ 'audio-phrase': settings.showAudioUnderline })}>
                            {ru}
                          </span>
                        </button>
                      ) : (
                        ru
                      )}
                    </div>
                  </td>
                  <td className="w-[50%] p-4 align-top">
                    <div
                      data-sentence="en"
                      ref={
                        selected?.idx === idx && selected.column === 'en'
                          ? selectedSentenceRef
                          : null
                      }
                      className={cn('sentence relative text-blue1', {
                        'sentence-selected':
                          keyboardMode && selected?.idx === idx && selected.column === 'en',
                      })}
                      onClick={() => setSelected({ idx, column: 'en' })}
                    >
                      <div aria-hidden={!isOpen}>
                        {enAudio ? (
                          <button
                            type="button"
                            className="text-left"
                            tabIndex={isOpen ? 0 : -1}
                            onClick={() => playAudio(enAudio)}
                          >
                            <span className={cn({ 'audio-phrase': settings.showAudioUnderline })}>
                              {en}
                            </span>
                          </button>
                        ) : (
                          en
                        )}
                      </div>
                      <button
                        type="button"
                        className={cn(
                          'absolute -bottom-1 left-0 right-0 top-0 w-full cursor-pointer bg-gray5 transition-opacity',
                          { 'pointer-events-none opacity-0': isOpen },
                        )}
                        aria-label="Открыть перевод"
                        aria-hidden={isOpen}
                        tabIndex={isOpen ? -1 : 0}
                        onClick={() => handleClickEnSentence(idx)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {controls}
    </div>
  );
};

export default Lesson;
