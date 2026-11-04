import React, { useEffect, useRef, useState } from 'react';
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

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [course, lesson]);

  const playAudio = (path: string) => {
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
  };

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
  };

  if (!translations || !openSentences || !favoriteTranslations) {
    return <FullPageSpinner />;
  }

  if (!translations.length) {
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
                  </td>
                  <td className="w-[50%] p-4 align-top">
                    <div className="relative text-blue1">
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
