import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { HiChevronDown, HiOutlineStar, HiStar } from 'react-icons/hi';
import { TbArrowsExchange, TbArrowsShuffle, TbEye, TbEyeOff } from 'react-icons/tb';
import { usePrevious } from 'react-use';
import cn from 'clsx';
import { shuffle } from 'lodash-es';
import Button from '@/components/common/Button/Button.tsx';
import FullPageSpinner from '@/components/common/FullPageSpinner/FullPageSpinner.tsx';
import { Course, Translation, TranslationTask } from '@/types';
import { useProgressStorage } from '@/utils/ProgressContext.ts';
import { AppSettings } from '@/utils/settings.ts';
import MobileLesson from './MobileLesson.tsx';
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
  toggleDictionary: () => void;
}

type Section = 'sentences' | 'dictionary';

const audioUrl = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/src\/assets\//, '')}`;

const loadTranslations = async (lessonPath: string, file: 'tasks' | 'words') => {
  const response = await fetch(`${import.meta.env.BASE_URL}${lessonPath}/${file}.json`, {
    headers: { Accept: 'application/json' },
  });
  if (response.status === 404) return file === 'words' ? [] : null;
  if (!response.ok) throw new Error(`Failed to load ${file}: ${response.status}`);

  const tasks: TranslationTask[] = await response.json();
  return tasks.map(({ id, ru, en }) => {
    const audio: Translation['audio'] = {};
    const audioPath = `${lessonPath}/audio/${file}_${String(id).padStart(3, '0')}`;
    if (ru.audio) audio.ru = `${audioPath}_ru.m4a`;
    if (en.audio) audio.en = `${audioPath}_en.m4a`;
    return { ru: ru.text, en: en.text, audio };
  });
};

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
  const [words, setWords] = useState<Translation[]>([]);
  const [wordOrder, setWordOrder] = useState<number[]>([]);
  const [openWords, setOpenWords] = useState<number[]>([]);
  const [dictionaryExpanded, setDictionaryExpanded] = useState(false);
  const [dictionaryMounted, setDictionaryMounted] = useState(false);
  const [section, setSection] = useState<Section>('sentences');
  const prevOpenSentences = usePrevious(openSentences);
  const [favoriteTranslations, setFavoriteTranslations] = useState<Translation[] | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCache = useRef(new AudioCache());
  const audioPrediction = useRef(new AudioPrediction());
  const [selected, setSelected] = useState<SentenceSelection | null>(null);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [mobileMode, setMobileMode] = useState(false);
  const [mobileRevealed, setMobileRevealed] = useState(false);
  const mobileDialogRef = useRef<HTMLDialogElement>(null);
  const mobileFullscreen = useRef(false);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const selectedSentenceRef = useRef<HTMLDivElement | null>(null);
  const inDictionary = section === 'dictionary';
  const activeOrder = inDictionary ? wordOrder : order;
  const activeTranslations = inDictionary ? words : translations;
  const resetOnLessonEnd = !inDictionary && settings.resetOnLessonEnd;

  useEffect(() => {
    if (dictionaryExpanded) {
      setDictionaryMounted(true);
      return;
    }
    const timer = setTimeout(() => setDictionaryMounted(false), 250);
    return () => clearTimeout(timer);
  }, [dictionaryExpanded]);

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
    if (mobileMode) return () => globalThis.speechSynthesis?.cancel();
  }, [mobileMode]);

  useEffect(() => {
    const preload = () => {
      const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection;
      const paths =
        activeTranslations && !document.hidden && !connection?.saveData
          ? audioPrediction.current.upcoming(
              activeTranslations,
              activeOrder,
              selected,
              sourceLanguage,
              resetOnLessonEnd,
            )
          : [];
      audioCache.current.preload(paths.map(audioUrl));
    };
    preload();
    document.addEventListener('visibilitychange', preload);
    return () => document.removeEventListener('visibilitychange', preload);
  }, [activeOrder, activeTranslations, resetOnLessonEnd, selected, sourceLanguage]);

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

  const stopAudio = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    setAudioBlocked(false);
  }, []);

  useEffect(() => {
    const handlePointerDown = () => setCursorVisible(false);
    document.addEventListener('pointerdown', handlePointerDown, true);
    return () => document.removeEventListener('pointerdown', handlePointerDown, true);
  }, []);

  const rememberSelection = useCallback(
    (nextSection: Section, next: SentenceSelection, key?: ArrowKey) => {
      if (nextSection !== section) audioPrediction.current.reset();
      audioPrediction.current.observe(
        next,
        nextSection === 'dictionary' ? wordOrder : order,
        key,
        sourceLanguage,
      );
      setSection(nextSection);
      setSelected(next);
    },
    [order, section, sourceLanguage, wordOrder],
  );

  const revealTranslation = useCallback((rowSection: Section, idx: number) => {
    const setOpen = rowSection === 'dictionary' ? setOpenWords : setOpenSentences;
    setOpen((current: number[] | null) =>
      current?.includes(idx) ? current : [...(current || []), idx],
    );
  }, []);

  const selectSentence = useCallback(
    (
      nextSection: Section,
      next: SentenceSelection,
      {
        announceCompletion,
        key,
        speech,
      }: { announceCompletion?: boolean; key?: ArrowKey; speech?: SpeechSynthesis } = {},
    ) => {
      const dictionary = nextSection === 'dictionary';
      const translation = (dictionary ? words : translations)?.[next.idx];
      if (!translation) return;
      rememberSelection(nextSection, next, key);
      if (dictionary) setDictionaryExpanded(true);
      setCursorVisible(true);
      if (next.column === targetLanguage) revealTranslation(nextSection, next.idx);
      const audio = translation.audio?.[next.column];
      const playPhrase = () => {
        if (audio) playAudio(audio);
        else if (speech) {
          const utterance = new SpeechSynthesisUtterance(translation[next.column]);
          utterance.lang = next.column;
          speech.speak(utterance);
        }
      };
      if (announceCompletion) {
        playAudio('sounds/lesson-complete.wav', playPhrase);
      } else {
        if (!audio) stopAudio();
        playPhrase();
      }
    },
    [
      playAudio,
      rememberSelection,
      revealTranslation,
      stopAudio,
      targetLanguage,
      translations,
      words,
    ],
  );

  const restart = useCallback(() => {
    if (!translations || !openSentences || !favoriteTranslations || !activeOrder.length) return;
    const newOrder = shuffle(activeOrder);
    audioPrediction.current.reset();
    if (inDictionary) {
      setWordOrder(newOrder);
      setOpenWords([]);
    } else {
      setOrder(newOrder);
      setOpenSentences([]);
    }
    selectSentence(
      section,
      { idx: newOrder[0], column: sourceLanguage },
      {
        announceCompletion: !inDictionary,
      },
    );
  }, [
    activeOrder,
    favoriteTranslations,
    inDictionary,
    openSentences,
    section,
    selectSentence,
    sourceLanguage,
    translations,
  ]);

  const navigate = useCallback(
    (key: ArrowKey) => {
      if (!translations || !openSentences || !favoriteTranslations) return;
      const next = getNextSentence(activeOrder, selected, key, sourceLanguage);
      if (!next) return;
      if (
        resetOnLessonEnd &&
        key === 'ArrowRight' &&
        selected?.idx === activeOrder[activeOrder.length - 1] &&
        selected?.column === targetLanguage
      ) {
        restart();
        return;
      }
      selectSentence(section, next, { key });
    },
    [
      activeOrder,
      favoriteTranslations,
      openSentences,
      resetOnLessonEnd,
      restart,
      section,
      selectSentence,
      selected,
      sourceLanguage,
      targetLanguage,
      translations,
    ],
  );

  const replay = useCallback(() => {
    if (!selected || !activeTranslations) return;
    if (inDictionary) setDictionaryExpanded(true);
    setCursorVisible(true);
    const audio = activeTranslations[selected.idx].audio?.[selected.column];
    if (audio) playAudio(audio);
  }, [activeTranslations, inDictionary, playAudio, selected]);

  const enterDictionary = useCallback(() => {
    if (!wordOrder.length) return;
    if (inDictionary && selected) {
      setDictionaryExpanded(true);
      setCursorVisible(true);
    } else {
      selectSentence('dictionary', { idx: wordOrder[0], column: sourceLanguage });
    }
  }, [inDictionary, selectSentence, selected, sourceLanguage, wordOrder]);

  const toggleDictionary = useCallback(() => {
    if (!inDictionary) {
      enterDictionary();
      return;
    }
    if (!order.length) return;
    setDictionaryExpanded(false);
    selectSentence('sentences', { idx: order[0], column: sourceLanguage });
  }, [enterDictionary, inDictionary, order, selectSentence, sourceLanguage]);

  useImperativeHandle(ref, () => ({ navigate, replay, restart, toggleDictionary }), [
    navigate,
    replay,
    restart,
    toggleDictionary,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isReplay = event.key === ' ' || event.key === 'Enter';
      const isRestart = event.key === 'Escape';
      const isDictionary = event.code === 'KeyV';
      if (
        (!isReplay &&
          !isRestart &&
          !isDictionary &&
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

      if (isDictionary) {
        if (!wordOrder.length) return;
        event.preventDefault();
        if (!event.repeat) toggleDictionary();
        return;
      }

      if (isRestart) {
        if (!activeOrder.length) return;
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

      if (!activeOrder.length) return;
      event.preventDefault();
      navigate(event.key as ArrowKey);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    activeOrder,
    favoriteTranslations,
    openSentences,
    navigate,
    replay,
    restart,
    selected,
    translations,
    toggleDictionary,
    wordOrder,
  ]);

  useEffect(() => {
    const sentence = selectedSentenceRef.current;
    if (!mobileMode && cursorVisible && sentence && !document.querySelector('dialog[open]')) {
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
  }, [
    cursorVisible,
    dictionaryExpanded,
    mobileMode,
    selected,
    settings.cursorZonePercent,
    settings.cursorScrollDurationMs,
  ]);

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

      const lessonPath = `translations/${encodeURIComponent(course)}/${encodeURIComponent(lesson)}`;
      const [loadedTranslations, newWords] =
        course === 'favorites'
          ? [await loadFavoriteTranslations(), []]
          : await Promise.all([
              loadTranslations(lessonPath, 'tasks'),
              loadTranslations(lessonPath, 'words'),
            ]);
      if (loadedTranslations === null && !newWords?.length) {
        throw new Error('Lesson tasks and dictionary are missing');
      }
      const newTranslations = loadedTranslations ?? [];
      const lessonWords = newWords ?? [];
      if (active) {
        setTranslations(newTranslations);
        setOrder(newTranslations.map((_, idx) => idx));
        setWords(lessonWords);
        setWordOrder(lessonWords.map((_, idx) => idx));
        setOpenWords([]);
        setDictionaryExpanded(false);
        setSection(!newTranslations.length && lessonWords.length ? 'dictionary' : 'sentences');
      }
    })().catch((error: unknown) => {
      console.error('Error loading lesson:', error);
      if (active) setLoadError(true);
    });
    return () => {
      active = false;
    };
  }, [course, lesson, loadFavoriteTranslations]);

  const handleClickTargetSentence = (rowSection: Section, idx: number) => {
    const dictionary = rowSection === 'dictionary';
    const audio = (dictionary ? words : translations)?.[idx]?.audio?.[targetLanguage];
    const open = dictionary ? openWords : openSentences;
    if (settings.autoPlayOnReveal && audio && !open?.includes(idx)) {
      playAudio(audio);
    }
    revealTranslation(rowSection, idx);
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
    setOpenWords([]);
  };

  const handleClickOpenAll = () => {
    setOpenSentences([...order]);
    setOpenWords([...wordOrder]);
  };

  const handleClickShuffle = () => {
    audioPrediction.current.reset();
    audioCache.current.preload([]);
    setOrder((v) => shuffle(v));
    setWordOrder((v) => shuffle(v));
    setSelected(null);
    setCursorVisible(false);
  };

  const handleClickSwap = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setAudioBlocked(false);
    setOpenSentences([]);
    setOpenWords([]);
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

  if (!order.length && !wordOrder.length) {
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

  const speakMobile = (
    idx: number,
    column: SentenceSelection['column'],
    announceCompletion = false,
  ) => {
    const speech = globalThis.speechSynthesis;
    speech?.cancel();
    selectSentence('sentences', { idx, column }, { announceCompletion, speech });
  };

  const showMobileSentence = (idx: number, announceCompletion = false) => {
    setMobileRevealed(false);
    speakMobile(idx, sourceLanguage, announceCompletion);
  };

  const openMobileMode = async () => {
    if (mobileFullscreen.current || mobileDialogRef.current?.open) return;
    if (!document.fullscreenElement && document.documentElement?.requestFullscreen) {
      mobileFullscreen.current = true;
      try {
        await document.documentElement.requestFullscreen();
      } catch {
        mobileFullscreen.current = false;
      }
      if (!mobileDialogRef.current) {
        if (mobileFullscreen.current && document.fullscreenElement === document.documentElement) {
          void document.exitFullscreen().catch(() => {});
        }
        mobileFullscreen.current = false;
        return;
      }
    }
    mobileDialogRef.current?.showModal();
    setMobileMode(true);
    showMobileSentence(!inDictionary && selected ? selected.idx : order[0]);
  };

  const revealMobileTranslation = () => {
    if (!selected) return;
    setMobileRevealed(true);
    speakMobile(selected.idx, targetLanguage);
  };

  const handleMobileArrow = (key: ArrowKey) => {
    if (key === 'ArrowDown') return revealMobileTranslation();
    if (!selected) return;
    if (key === 'ArrowUp') return speakMobile(selected.idx, sourceLanguage);

    const row = order.indexOf(selected.idx) + (key === 'ArrowRight' ? 1 : -1);
    if (row < 0) return;
    if (row < order.length) {
      showMobileSentence(order[row]);
      return;
    }

    const nextOrder = shuffle(order);
    setOrder(nextOrder);
    audioPrediction.current.reset();
    showMobileSentence(nextOrder[0], true);
  };

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
      {!!order.length && (
        <Button intent="outline" aria-haspopup="dialog" onClick={openMobileMode}>
          TV-режим
        </Button>
      )}
    </div>
  );

  const renderRows = (rowSection: Section) => {
    const dictionary = rowSection === 'dictionary';
    const rows = dictionary ? words : translations;
    const rowOrder = dictionary ? wordOrder : order;
    const openRows = dictionary ? openWords : openSentences;
    const selectRow = (
      event: React.MouseEvent,
      idx: number,
      column: SentenceSelection['column'],
    ) => {
      if (inDictionary && !dictionary && event.detail === 0) return;
      rememberSelection(rowSection, { idx, column });
    };
    return (
      <table className="w-full">
        <tbody className="divide-y divide-gray5 bg-white">
          {rowOrder.map((idx) => {
            const translation = rows[idx];
            const { ru, en, audio } = translation;
            const sourceAudio = audio?.[sourceLanguage];
            const targetAudio = audio?.[targetLanguage];

            const isOpen = openRows.includes(idx);
            const isFavorite = favoriteTranslations.find((i) => i.ru === ru && i.en === en);
            const selectedColumn =
              section === rowSection && selected?.idx === idx ? selected.column : null;
            return (
              <tr
                key={`${course}_${lesson}_${idx}`}
                className="grid grid-cols-[40px_minmax(0,1fr)] bg-white hover:bg-light-gray5 sm:table-row sm:w-[50%]"
              >
                <td className="row-span-2 pt-3 sm:w-[1px] sm:px-2 sm:pt-0">
                  <button
                    type="button"
                    className="flex min-h-10 min-w-8 items-center justify-center rounded focus-visible:outline-blue2"
                    onClick={(event) => {
                      if (section !== rowSection) selectRow(event, idx, sourceLanguage);
                      addRemoveFromFavoriteTranslations(translation);
                    }}
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
                <td
                  className="min-w-0 px-3 pb-1 pt-3 text-left align-top sm:p-4 sm:text-right"
                  onClick={(event) => selectRow(event, idx, sourceLanguage)}
                >
                  <div
                    data-sentence={sourceLanguage}
                    lang={sourceLanguage}
                    ref={selectedColumn === sourceLanguage ? selectedSentenceRef : null}
                    className={cn('sentence break-words', {
                      'sentence-selected': cursorVisible && selectedColumn === sourceLanguage,
                    })}
                  >
                    {sourceAudio ? (
                      <button
                        type="button"
                        className="text-left sm:text-right"
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
                <td
                  className="min-w-0 px-3 pb-3 pt-1 align-top sm:w-[50%] sm:p-4"
                  onClick={(event) => selectRow(event, idx, targetLanguage)}
                >
                  <div
                    data-sentence={targetLanguage}
                    lang={targetLanguage}
                    ref={selectedColumn === targetLanguage ? selectedSentenceRef : null}
                    className={cn('sentence relative min-h-6 break-words text-blue1', {
                      'sentence-selected': cursorVisible && selectedColumn === targetLanguage,
                    })}
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
                      onClick={() => handleClickTargetSentence(rowSection, idx)}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

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
      {!!wordOrder.length && (
        <div className="mx-auto my-8 max-w-[800px] overflow-hidden rounded-lg border border-gray3">
          <button
            type="button"
            aria-expanded={dictionaryExpanded}
            aria-controls="lesson-dictionary"
            className="flex w-full items-center justify-between bg-white p-4 text-left font-semibold hover:bg-light-gray5 focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-blue2"
            onClick={() => {
              setDictionaryExpanded(!dictionaryExpanded);
              if (!dictionaryExpanded && !inDictionary) {
                audioPrediction.current.reset();
                setSection('dictionary');
                setSelected(null);
              }
            }}
          >
            Словарь ({words.length})
            <HiChevronDown
              className={cn('transition-transform duration-200 motion-reduce:transition-none', {
                'rotate-180': dictionaryExpanded,
              })}
              aria-hidden="true"
            />
          </button>
          <div
            id="lesson-dictionary"
            aria-hidden={!dictionaryExpanded}
            ref={(element) => element?.toggleAttribute('inert', !dictionaryExpanded)}
            className={cn(
              'grid transition-[grid-template-rows] duration-200 ease-in-out motion-reduce:transition-none',
              dictionaryExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
            )}
          >
            <div className="min-h-0 overflow-hidden">
              {(dictionaryExpanded || dictionaryMounted) && (
                <div className="border-t border-gray3">{renderRows('dictionary')}</div>
              )}
            </div>
          </div>
        </div>
      )}
      {!!order.length && (
        <div className="mx-auto my-8 max-w-[800px] overflow-hidden rounded-lg border border-gray3">
          {renderRows('sentences')}
        </div>
      )}
      {controls}
      {!!order.length && (
        <MobileLesson
          dialogRef={mobileDialogRef}
          phrase={mobileMode && selected ? translations[selected.idx] : null}
          sourceLanguage={sourceLanguage}
          revealed={mobileRevealed}
          onArrow={handleMobileArrow}
          onReveal={revealMobileTranslation}
          onClose={() => {
            if (
              mobileFullscreen.current &&
              document.fullscreenElement === document.documentElement
            ) {
              void document.exitFullscreen().catch(() => {});
            }
            mobileFullscreen.current = false;
            stopAudio();
            setMobileMode(false);
            setCursorVisible(true);
          }}
          onRetryAudio={
            audioBlocked ? () => audioRef.current && startAudio(audioRef.current) : undefined
          }
        />
      )}
    </div>
  );
});

Lesson.displayName = 'Lesson';

export default Lesson;
