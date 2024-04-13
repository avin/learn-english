import React, { useEffect, useState } from 'react';
import { usePrevious } from 'react-use';
import cn from 'clsx';
import Button from '@/components/common/Button/Button.tsx';
import { Course, Translation } from '@/types';
import { localStorageGetItem, localStorageSetItem } from '@/utils/localStorage.ts';

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

  useEffect(() => {
    void (async () => {
      setTranslations(null);
      const newTranslations = (
        await import(`../../../../assets/translations/${course}/${lesson}.json`)
      ).default;
      setTranslations(newTranslations);

      setOpenSentences(getLastOpenSentences(course, lesson));
    })();
  }, [course, lesson]);

  const handleClickEnSentence = (e: React.MouseEvent<HTMLTableCellElement>) => {
    const idx = Number(e.currentTarget.dataset.idx);
    setOpenSentences((v) => (v.includes(idx) ? v : [...v, idx]));
  };

  useEffect(() => {
    if (openSentences !== prevOpenSentences) {
      localStorageSetItem(`lastOpenSentences_${course}_${lesson}`, JSON.stringify(openSentences));
    }
  }, [course, lesson, openSentences, prevOpenSentences]);

  const handleClickCloseAll = () => {
    setOpenSentences([]);
  };

  const handleClickOpenAll = () => {
    setOpenSentences(new Array(translations?.length).fill(0).map((_, idx) => idx));
  };

  if (!translations) {
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
              return (
                <tr
                  key={`${course}_${lesson}_${idx}`}
                  className="divide-x divide-gray3 bg-white w-[50%] hover:bg-light-gray5"
                >
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