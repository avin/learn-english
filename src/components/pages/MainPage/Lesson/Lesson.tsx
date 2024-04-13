import React, { useEffect, useState } from 'react';
import { HiOutlineStar, HiStar } from 'react-icons/hi';
import { usePrevious } from 'react-use';
import cn from 'clsx';
import Button from '@/components/common/Button/Button.tsx';
import { Course, Translation } from '@/types';
import {
  loadFavoriteTranslations,
  localStorageGetItem,
  localStorageSetItem,
  saveFavoriteTranslations,
} from '@/utils/localStorage.ts';

const getLastOpenSentences = (course: Course, lesson: string): number[] => {
  const lastOpenSentences = localStorageGetItem(`lastOpenSentences_${course}_${lesson}`);
  if (lastOpenSentences) {
    return JSON.parse(lastOpenSentences);
  }
  return [];
};

interface Props {
  course: Course;
  lesson: string;
}

const Lesson = ({ course, lesson }: Props) => {
  const [translations, setTranslations] = useState<Translation | null>(null);
  const [openSentences, setOpenSentences] = useState<number[]>(
    getLastOpenSentences(course, lesson),
  );
  const prevOpenSentences = usePrevious(openSentences);
  const [favoriteTranslations, setFavoriteTranslations] = useState<Translation[]>([]);

  useEffect(() => {
    setFavoriteTranslations(loadFavoriteTranslations());
  }, []);

  const addRemoveFromFavoriteTranslations = (translation: Translation) => {
    setFavoriteTranslations((v) => {
      const result = (() => {
        const existingItem = v.find((i) => i[0] === translation[0] && i[1] === translation[1]);
        if (existingItem) {
          return v.filter((i) => i !== existingItem);
        } else {
          return [...v, translation];
        }
      })();

      saveFavoriteTranslations(result);
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
          return (await import(`../../../../assets/translations/${course}/${lesson}.json`)).default;
        }
      })();
      setTranslations(newTranslations);

      setOpenSentences(getLastOpenSentences(course, lesson));
    })();
  }, [course, lesson]);

  const handleClickEnSentence = (e: React.MouseEvent<HTMLTableCellElement>) => {
    const idx = Number(e.currentTarget.dataset.idx);
    setOpenSentences((v) => (v.includes(idx) ? v : [...v, idx]));
  };

  useEffect(() => {
    if (openSentences !== prevOpenSentences && course !== 'favorites') {
      localStorageSetItem(`lastOpenSentences_${course}_${lesson}`, JSON.stringify(openSentences));
    }
  }, [course, lesson, openSentences, prevOpenSentences]);

  const handleClickCloseAll = () => {
    setOpenSentences([]);
  };

  const handleClickOpenAll = () => {
    setOpenSentences(new Array(translations?.length).fill(0).map((_, idx) => idx));
  };

  if (!translations || !translations.length) {
    return null;
  }

  const controls = (
    <div className="flex justify-center space-x-2">
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
      <div className="mx-auto max-w-[800px] border border-gray3 rounded-lg overflow-hidden my-8">
        <table className="w-full divide-y divide-gray3 ">
          <tbody className="divide-y divide-gray3 bg-white">
            {translations.map(([ru, en], idx) => {
              const isOpen = openSentences.includes(idx);
              const isFavorite = favoriteTranslations.find((i) => i[0] === ru && i[1] === en);
              return (
                <tr
                  key={`${course}_${lesson}_${idx}`}
                  className="bg-white w-[50%] hover:bg-light-gray5"
                >
                  <td
                    className="px-2 cursor-pointer w-[1px]"
                    onClick={() => {
                      addRemoveFromFavoriteTranslations([ru, en]);
                    }}
                  >
                    {isFavorite ? (
                      <HiStar size={24} className="text-orange5 opacity-50" />
                    ) : (
                      <HiOutlineStar size={24} className="text-light-gray3" />
                    )}
                  </td>
                  <td className="p-4 align-top text-right">{ru}</td>
                  <td
                    className={cn('p-4 align-top w-[50%]', {
                      'cursor-pointer': !isOpen,
                    })}
                    onClick={handleClickEnSentence}
                    data-idx={idx}
                  >
                    <div
                      className={cn('transition-all', {
                        'text-left text-gray5 bg-gray5 w-full h-full': !isOpen,
                        'text-blue1': isOpen,
                      })}
                    >
                      {en}
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
