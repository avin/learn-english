import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { HiOutlineStar, HiStar } from 'react-icons/hi';
import { TbArrowsExchange, TbArrowsShuffle, TbEye, TbEyeOff } from 'react-icons/tb';
import { usePrevious } from 'react-use';
import cn from 'clsx';
import { shuffle } from 'lodash-es';
import Button from '@/components/common/Button/Button.tsx';
import FullPageSpinner from '@/components/common/FullPageSpinner/FullPageSpinner.tsx';
import { Course, Translation, TranslationTask } from '@/types';
import { useProgressStorage } from '@/utils/ProgressContext.ts';
import { AppSettings } from '@/utils/settings.ts';
import { AudioCache } from './audioCache.ts';
import { AudioPrediction } from './audioPrediction.ts';
import { ArrowKey, SentenceSelection, getNextSentence } from './navigation.ts';

interface Props {
  course: Course;
  lesson: string;
  settings: AppSettings;
  onSwapDirection: () => void;
}

export interface LessonControls {
  navigate: (key: ArrowKey) => void;
  replay: () => void;
  restart: () => void;
}

const audioUrl = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/src\/assets\//, '')}`;

const Lesson = forwardRef<LessonControls, Props>((props, ref) => {
  const { course, lesson, settings, onSwapDirection } = props;
  const sourceLanguage = settings.sourceLanguage;
  const targetLanguage = sourceLanguage === 'ru' ? 'en' : 'ru';
  const {
    loadFavoriteTranslations,
    loadLastOpenSentences,
    saveFavoriteTranslations,
    saveLastOpenSentences,
  } = useProgressStorage();
  const [translations, setTranslations] = useState<Translation[] | null>(null);
  const [order, setOrder] = useState<number[]>([]);
  const [openSentences, setOpenSentences] = useState<number[] | null>(null);
  const prevOpenSentences = usePrevious(openSentences);
  const [favoriteTranslations, setFavoriteTranslations] = useState<Translation[] | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCache = useRef(new AudioCache());
  const audioPrediction = useRef(new AudioPrediction());
  const [selected, setSelected] = useState<SentenceSelection | null>(null);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const selectedSentenceRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    audioPrediction.current.reset();
    setSelected(null);
    setAudioBlocked(false);
    const cache = audioCache.current;
    return () => {
      audioRef.current = null;
      cache.clear();
    };
  }, [course, lesson, sourceLanguage]);

  useEffect(() => {
    const preload = () => {
      const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection;
      const paths =
        translations && !document.hidden && !connection?.saveData
          ? audioPrediction.current.upcoming(
              translations,
              order,
              selected,
              sourceLanguage,
              settings.resetOnLessonEnd,
            )
          : [];
      audioCache.current.preload(paths.map(audioUrl));
    };
    preload();
    document.addEventListener('visibilitychange', preload);
    return () => document.removeEventListener('visibilitychange', preload);
  }, [order, selected, settings.resetOnLessonEnd, sourceLanguage, translations]);

  const startAudio = useCallback((audio: HTMLAudioElement) => {
    void audio.play().then(
      () => {
        if (audioRef.current === audio) setAudioBlocked(false);
      },
      (error: unknown) => {
        if (audioRef.current !== audio) return;
        if (error instanceof DOMException && error.name === 'NotAllowedError') {
          setAudioBlocked(true);
          return;
        }
        if (error instanceof DOMException && error.name === 'AbortError') return;
        console.error('Error playing phrase audio:', error);
      },
    );
  }, []);

  const playAudio = useCallback(
    (path: string, onFinished?: () => void) => {
      audioRef.current?.pause();
      const audio = audioCache.current.get(audioUrl(path));
      audioRef.current = audio;
      audio.onended = null;
      audio.onerror = null;
      audio.currentTime = 0;
      if (onFinished) {
        const finish = () => {
          if (audioRef.current === audio) onFinished();
        };
        audio.onended = finish;
        audio.onerror = finish;
      }
      startAudio(audio);
    },
    [startAudio],
  );

  useEffect(() => {
    const handlePointerDown = () => setCursorVisible(false);
    document.addEventListener('pointerdown', handlePointerDown, true);
    return () => document.removeEventListener('pointerdown', handlePointerDown, true);
  }, []);

  const rememberSelection = useCallback(
    (next: SentenceSelection, key?: ArrowKey) => {
      audioPrediction.current.observe(next, order, key, sourceLanguage);
      setSelected(next);
    },
    [order, sourceLanguage],
  );

  const selectSentence = useCallback(
    (next: SentenceSelection, announceCompletion = false, key?: ArrowKey) => {
      if (!translations) return;
      rememberSelection(next, key);
      setCursorVisible(true);
      if (next.column === targetLanguage) {
        setOpenSentences((current) =>
          current?.includes(next.idx) ? current : [...(current || []), next.idx],
        );
      }
      const audio = translations[next.idx].audio?.[next.column];
      if (announceCompletion) {
        playAudio('sounds/lesson-complete.wav', () => {
          if (audio) playAudio(audio);
        });
      } else if (audio) playAudio(audio);
      else {
        audioRef.current?.pause();
        audioRef.current = null;
        setAudioBlocked(false);
      }
    },
    [playAudio, rememberSelection, targetLanguage, translations],
  );

  const restart = useCallback(() => {
    if (!translations || !openSentences || !favoriteTranslations || !order.length) return;
    const newOrder = shuffle(order);
    audioPrediction.current.reset();
    setOrder(newOrder);
    setOpenSentences([]);
    selectSentence({ idx: newOrder[0], column: sourceLanguage }, true);
  }, [favoriteTranslations, openSentences, order, selectSentence, sourceLanguage, translations]);

  const navigate = useCallback(
    (key: ArrowKey) => {
      if (!translations || !openSentences || !favoriteTranslations) return;
      const next = getNextSentence(order, selected, key, sourceLanguage);
      if (!next) return;
      if (
        settings.resetOnLessonEnd &&
        key === 'ArrowRight' &&
        selected?.idx === order[order.length - 1] &&
        selected?.column === targetLanguage
      ) {
        restart();
        return;
      }
      selectSentence(next, false, key);
    },
    [
      favoriteTranslations,
      openSentences,
      order,
      restart,
      selectSentence,
      selected,
      settings.resetOnLessonEnd,
      sourceLanguage,
      targetLanguage,
      translations,
    ],
  );

  const replay = useCallback(() => {
    if (!selected || !translations) return;
    setCursorVisible(true);
    const audio = translations[selected.idx].audio?.[selected.column];
    if (audio) playAudio(audio);
  }, [playAudio, selected, translations]);

  useImperativeHandle(ref, () => ({ navigate, replay, restart }), [navigate, replay, restart]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isReplay = event.key === ' ' || event.key === 'Enter';
      const isRestart = event.key === 'Escape';
      if (
        (!isReplay &&
          !isRestart &&
          !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.isComposing ||
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

      if (isRestart) {
        if (!order.length) return;
        event.preventDefault();
        if (!event.repeat) restart();
        return;
      }

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
        replay();
        return;
      }

      if (!order.length) return;
      event.preventDefault();
      navigate(event.key as ArrowKey);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    favoriteTranslations,
    openSentences,
    order,
    navigate,
    replay,
    restart,
    selected,
    translations,
  ]);

  useEffect(() => {
    const sentence = selectedSentenceRef.current;
    if (cursorVisible && sentence && !document.querySelector('dialog[open]')) {
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
  }, [cursorVisible, selected, settings.cursorZonePercent, settings.cursorScrollDurationMs]);

  useEffect(() => {
    let active = true;
    setOpenSentences(null);
    void loadLastOpenSentences(course, lesson).then((sentences) => {
      if (active) setOpenSentences(sentences);
    });
    return () => {
      active = false;
    };
  }, [course, lesson, loadLastOpenSentences]);

  useEffect(() => {
    let active = true;
    void loadFavoriteTranslations().then((favoriteTranslations) => {
      if (active) setFavoriteTranslations(favoriteTranslations);
    });
    return () => {
      active = false;
    };
  }, [loadFavoriteTranslations]);

  const addRemoveFromFavoriteTranslations = (translation: Translation) => {
    if (course === 'favorites') {
      const removedIdx = translations?.indexOf(translation);
      if (removedIdx !== undefined && removedIdx !== -1) {
        const row = order.indexOf(removedIdx);
        const remaining = order.filter((idx) => idx !== removedIdx);
        setOrder(remaining);
        audioPrediction.current.reset();
        if (selected?.idx === removedIdx) {
          setSelected(
            remaining.length
              ? { idx: remaining[row % remaining.length], column: sourceLanguage }
              : null,
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
      setLoadError(false);

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
            const audioPath = `${lessonPath}/audio/tasks_${String(id).padStart(3, '0')}`;
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
    })().catch((error: unknown) => {
      console.error('Error loading lesson:', error);
      if (active) setLoadError(true);
    });
    return () => {
      active = false;
    };
  }, [course, lesson, loadFavoriteTranslations]);

  const handleClickTargetSentence = (idx: number) => {
    const audio = translations?.[idx]?.audio?.[targetLanguage];
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
  }, [course, lesson, openSentences, prevOpenSentences, saveLastOpenSentences]);

  const handleClickCloseAll = () => {
    setOpenSentences([]);
  };

  const handleClickOpenAll = () => {
    setOpenSentences(new Array(translations?.length).fill(0).map((_, idx) => idx));
  };

  const handleClickShuffle = () => {
    audioPrediction.current.reset();
    audioCache.current.preload([]);
    setOrder((v) => shuffle(v));
    setSelected(null);
    setCursorVisible(false);
  };

  const handleClickSwap = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setAudioBlocked(false);
    setOpenSentences([]);
    setSelected(null);
    setCursorVisible(false);
    onSwapDirection();
  };

  if (loadError) {
    return (
      <div
        role="alert"
        className="mx-auto max-w-xl rounded-lg border border-gray5 bg-white p-6 text-center"
      >
        <h2 className="font-semibold text-dark-gray1">Не удалось загрузить урок</h2>
        <p className="mb-4 mt-2 text-sm text-gray1">
          Для загрузки упражнений нужен интернет. Проверьте подключение и обновите страницу.
        </p>
        <Button intent="primary" onClick={() => window.location.reload()}>
          Обновить страницу
        </Button>
      </div>
    );
  }

  if (!translations || !openSentences || !favoriteTranslations) {
    return <FullPageSpinner />;
  }

  if (!order.length) {
    return (
      <div className="mx-auto max-w-xl rounded-lg border border-gray5 bg-white p-8 text-center">
        <HiOutlineStar size={32} className="mx-auto mb-3 text-orange2" aria-hidden="true" />
        <h2 className="font-semibold text-dark-gray1">Здесь будут избранные фразы</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray1">
          Откройте урок и нажмите на звёздочку рядом с фразой, которую хотите повторить.
        </p>
      </div>
    );
  }

  const controls = (
    <div className="flex flex-wrap justify-center gap-2">
      <Button
        onClick={handleClickSwap}
        intent="outline"
        className="inline-flex items-center gap-1.5"
        title={
          sourceLanguage === 'ru' ? 'Сейчас: русский → английский' : 'Сейчас: английский → русский'
        }
        aria-pressed={sourceLanguage === 'en'}
      >
        <TbArrowsExchange size={16} aria-hidden="true" />
        Поменять
      </Button>
      <Button
        onClick={handleClickShuffle}
        intent="outline"
        className="inline-flex items-center gap-1.5"
      >
        <TbArrowsShuffle size={16} className="text-orange2" aria-hidden="true" />
        Перемешать
      </Button>
      <Button
        onClick={handleClickOpenAll}
        intent="outline"
        className="inline-flex items-center gap-1.5"
      >
        <TbEye size={16} className="text-blue2" aria-hidden="true" />
        Открыть все
      </Button>
      <Button
        onClick={handleClickCloseAll}
        intent="outline"
        className="inline-flex items-center gap-1.5"
      >
        <TbEyeOff size={16} className="text-red2" aria-hidden="true" />
        Закрыть все
      </Button>
    </div>
  );

  return (
    <div className="fade-in">
      {controls}
      {audioBlocked && (
        <div className="mt-4 flex items-center justify-center gap-3" role="status">
          <span>Нажмите, чтобы разрешить озвучку.</span>
          <Button intent="outline" onClick={() => audioRef.current && startAudio(audioRef.current)}>
            Включить звук
          </Button>
        </div>
      )}
      <div className="mx-auto my-8 max-w-[800px] overflow-hidden rounded-lg border border-gray3">
        <table className="w-full">
          <tbody className="divide-y divide-gray5 bg-white">
            {order.map((idx) => {
              const translation = translations[idx];
              const { ru, en, audio } = translation;
              const sourceAudio = audio?.[sourceLanguage];
              const targetAudio = audio?.[targetLanguage];

              const isOpen = openSentences.includes(idx);
              const isFavorite = favoriteTranslations.find((i) => i.ru === ru && i.en === en);
              return (
                <tr
                  key={`${course}_${lesson}_${idx}`}
                  className="w-[50%] bg-white hover:bg-light-gray5"
                >
                  <td className="w-[1px] px-2">
                    <button
                      type="button"
                      className="flex min-h-10 min-w-8 items-center justify-center rounded focus-visible:outline-blue2"
                      onClick={() => addRemoveFromFavoriteTranslations(translation)}
                      aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
                      aria-pressed={!!isFavorite}
                    >
                      {isFavorite ? (
                        <HiStar size={24} className="text-orange5 opacity-50" aria-hidden="true" />
                      ) : (
                        <HiOutlineStar size={24} className="text-gray4" aria-hidden="true" />
                      )}
                    </button>
                  </td>
                  <td className="p-4 text-right align-top">
                    <div
                      data-sentence={sourceLanguage}
                      lang={sourceLanguage}
                      ref={
                        selected?.idx === idx && selected.column === sourceLanguage
                          ? selectedSentenceRef
                          : null
                      }
                      className={cn('sentence', {
                        'sentence-selected':
                          cursorVisible &&
                          selected?.idx === idx &&
                          selected.column === sourceLanguage,
                      })}
                      onClick={() => rememberSelection({ idx, column: sourceLanguage })}
                    >
                      {sourceAudio ? (
                        <button
                          type="button"
                          className="text-right"
                          onClick={() => playAudio(sourceAudio)}
                        >
                          <span className={cn({ 'audio-phrase': settings.showAudioUnderline })}>
                            {translation[sourceLanguage]}
                          </span>
                        </button>
                      ) : (
                        translation[sourceLanguage]
                      )}
                    </div>
                  </td>
                  <td className="w-[50%] p-4 align-top">
                    <div
                      data-sentence={targetLanguage}
                      lang={targetLanguage}
                      ref={
                        selected?.idx === idx && selected.column === targetLanguage
                          ? selectedSentenceRef
                          : null
                      }
                      className={cn('sentence relative text-blue1', {
                        'sentence-selected':
                          cursorVisible &&
                          selected?.idx === idx &&
                          selected.column === targetLanguage,
                      })}
                      onClick={() => rememberSelection({ idx, column: targetLanguage })}
                    >
                      <div aria-hidden={!isOpen}>
                        {targetAudio ? (
                          <button
                            type="button"
                            className="text-left"
                            tabIndex={isOpen ? 0 : -1}
                            onClick={() => playAudio(targetAudio)}
                          >
                            <span className={cn({ 'audio-phrase': settings.showAudioUnderline })}>
                              {translation[targetLanguage]}
                            </span>
                          </button>
                        ) : (
                          translation[targetLanguage]
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
                        onClick={() => handleClickTargetSentence(idx)}
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
});

Lesson.displayName = 'Lesson';

export default Lesson;
