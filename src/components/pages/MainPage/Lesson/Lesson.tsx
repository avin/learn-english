import React, { useEffect, useRef, useState } from 'react';
import { HiOutlineStar, HiStar } from 'react-icons/hi';
import { usePrevious } from 'react-use';
import cn from 'clsx';
import { shuffle } from 'lodash-es';
import Button from '@/components/common/Button/Button.tsx';
import FullPageSpinner from '@/components/common/FullPageSpinner/FullPageSpinner.tsx';
import { Course, Translation, TranslationTask } from '@/types';
import {
  loadFavoriteTranslations,
  loadLastOpenSentences,
  saveFavoriteTranslations,
  saveLastOpenSentences,
} from '@/utils/storage.ts';

interface Props {
  course: Course;
  lesson: string;
}

const audioFiles = import.meta.glob<string>('/src/assets/translations/*/*/audio/*.m4a', {
  eager: true,
  query: '?url',
  import: 'default',
});

const Lesson = ({ course, lesson }: Props) => {
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
    const url = audioFiles[path];
    if (!url) {
      return;
    }

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
    void (async () => {
      setTranslations(null);

      const newTranslations = await (async () => {
        if (course === 'favorites') {
          return loadFavoriteTranslations();
        } else {
          const tasks: TranslationTask[] = (
            await import(`../../../../assets/translations/${course}/${lesson}/tasks.json`)
          ).default;
          return tasks.map(({ id, ru, en }) => {
            const audio: Translation['audio'] = {};
            const audioPath = `/src/assets/translations/${course}/${lesson}/audio/${String(id).padStart(3, '0')}`;
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
      setTranslations(newTranslations);
      setOrder(new Array(newTranslations.length).fill(0).map((_, idx) => idx));
    })();
  }, [course, lesson]);

  const handleClickEnSentence = (e: React.MouseEvent<HTMLTableCellElement>) => {
    const idx = Number(e.currentTarget.dataset.idx);
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
                        <span className="audio-phrase">{ru}</span>
                      </button>
                    ) : (
                      ru
                    )}
                  </td>
                  <td
                    className={cn('w-[50%] p-4 align-top', {
                      'cursor-pointer': !isOpen,
                    })}
                    onClick={handleClickEnSentence}
                    data-idx={idx}
                  >
                    <div
                      className={cn('transition-all', {
                        'h-full w-full bg-gray5 text-left text-gray5': !isOpen,
                        'text-blue1': isOpen,
                      })}
                    >
                      {enAudio ? (
                        <button
                          type="button"
                          className="text-left"
                          onClick={() => playAudio(enAudio)}
                        >
                          <span className={cn({ 'audio-phrase': isOpen })}>{en}</span>
                        </button>
                      ) : (
                        en
                      )}
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
