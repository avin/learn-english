import React, { useEffect, useState } from 'react';
import { usePrevious } from 'react-use';
import cn from 'clsx';
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

  if (!translations) {
    return null;
  }

  return (
    <div>
      <div className="flex justify-center mb-8">
        <button>Reset</button>
      </div>
      <div className="mx-auto max-w-[800px] border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full divide-y divide-gray-300 ">
          <tbody className="divide-y divide-gray-200 bg-white">
            {translations.map(([ru, en], idx) => {
              const isOpen = openSentences.includes(idx);
              return (
                <tr
                  key={`${course}_${lesson}_${idx}`}
                  className="divide-x divide-gray-200 bg-white w-[50%]"
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
                        'text-left text-gray-200 bg-gray-200 w-full h-full': !isOpen,
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
    </div>
  );
};

export default Lesson;
