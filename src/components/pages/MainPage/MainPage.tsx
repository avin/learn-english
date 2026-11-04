import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HiArrowUp, HiOutlineCog } from 'react-icons/hi';
import Button from '@/components/common/Button/Button.tsx';
import FullPageSpinner from '@/components/common/FullPageSpinner/FullPageSpinner.tsx';
import Select from '@/components/common/Select/Select.tsx';
import UserButton from '@/components/common/UserButton/UserButton.tsx';
import Lesson, { LessonControls } from '@/components/pages/MainPage/Lesson/Lesson.tsx';
import Settings from '@/components/pages/MainPage/Settings.tsx';
import { Course } from '@/types';
import { AppSettings, loadSettings, saveSettings } from '@/utils/settings.ts';
import { loadLastCourse, loadLastLesson, saveLastCourse, saveLastLesson } from '@/utils/storage.ts';
import { useGamepad } from '@/utils/useGamepad.ts';

type Options = { label: string; value: string }[];

const titanLessonOptions = ((): Options => {
  const parts = [
    { from: 1, to: 50, prefix: 'A0' },
    { from: 51, to: 100, prefix: 'A1' },
    { from: 101, to: 150, prefix: 'A2' },
    { from: 151, to: 200, prefix: 'B1' },
    { from: 201, to: 250, prefix: 'B2' },
  ];
  return new Array(211).fill(null).map((i, idx) => {
    const lessonId = idx + 1;
    const part = parts.find((i) => lessonId >= i.from && lessonId <= i.to)!;
    return { label: `${part.prefix} - ${lessonId}`, value: String(lessonId) };
  });
})();

const expressLessonOptions = ((): Options => {
  const parts = [
    { from: 1, to: 50, prefix: 'A0' },
    { from: 1, to: 50, prefix: 'A1' },
    { from: 1, to: 50, prefix: 'A2' },
    { from: 1, to: 50, prefix: 'B1' },
    { from: 1, to: 22, prefix: 'B2' },
  ];
  const result: Options = [];
  parts.forEach((part) => {
    for (let i = part.from; i <= part.to; i++) {
      if (i % 2) {
        result.push({
          label: `${part.prefix} - ${i}-${i + 1}`,
          value: `${part.prefix} ${i}-${i + 1}`,
        });
      }
    }
  });
  return result;
})();

const MainPage = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<string | null>(null);
  const [settings, setSettings] = useState(loadSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const lessonRef = useRef<LessonControls>(null);

  const lessonOptions = useMemo(() => {
    if (course === 'titan') {
      return titanLessonOptions;
    }
    if (course === 'express') {
      return expressLessonOptions;
    }
    return [];
  }, [course]);

  useEffect(() => {
    if (course === null) {
      void loadLastCourse().then((course) => setCourse(course));
    }

    if (course && !lesson) {
      void loadLastLesson(course).then((lesson) => {
        if (lesson) {
          setLesson(lesson);
        } else {
          setLesson(lessonOptions[0]?.value || '');
        }
      });
    }
  }, [course, lesson, lessonOptions]);

  const handleChangeCourse = (val: string) => {
    const course = val as Course;
    setCourse(course);
    setLesson(null);

    void saveLastCourse(course);
  };

  const handleChangeLesson = useCallback(
    (val: string) => {
      if (!course) return;
      setLesson(val);

      void saveLastLesson(course, val);
    },
    [course],
  );

  const changeAdjacentLesson = useCallback(
    (direction: number) => {
      const index = lessonOptions.findIndex((option) => option.value === lesson);
      if (index === -1) return;
      const next = lessonOptions[index + direction];
      if (next) handleChangeLesson(next.value);
    },
    [handleChangeLesson, lesson, lessonOptions],
  );

  useGamepad(
    (action) => {
      if (action === 'previousLesson' || action === 'nextLesson') {
        changeAdjacentLesson(action === 'nextLesson' ? 1 : -1);
      } else if (action === 'replay') {
        lessonRef.current?.replay();
      } else if (action === 'restart') {
        lessonRef.current?.restart();
      } else {
        lessonRef.current?.navigate(action);
      }
    },
    settings.gamepadEnabled,
    !course || lesson === null || settingsOpen,
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        !event.shiftKey ||
        !['ArrowLeft', 'ArrowRight'].includes(event.key) ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.isComposing ||
        event.defaultPrevented ||
        settingsOpen ||
        !course ||
        lesson === null
      )
        return;

      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.closest('input, textarea, select, [role="combobox"], [role="slider"]'))
      )
        return;

      const index = lessonOptions.findIndex((option) => option.value === lesson);
      if (index === -1) return;
      event.preventDefault();
      if (event.repeat) return;
      changeAdjacentLesson(event.key === 'ArrowRight' ? 1 : -1);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [changeAdjacentLesson, course, lesson, lessonOptions, settingsOpen]);

  const handleSettingsChange = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  if (!course) {
    return <FullPageSpinner />;
  }

  return (
    <div>
      <div className="flex items-center justify-between border-b border-gray3 bg-light-gray3 px-4 py-2">
        <div className="flex items-center gap-3">
          <h1 className="text-gray-500 text-lg font-bold">Learn English</h1>
          <Button onClick={() => setSettingsOpen(true)} intent="outline" aria-label="Настройки">
            <HiOutlineCog size={18} />
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <Select
            label="Курс"
            value={course}
            onChange={handleChangeCourse}
            options={[
              { label: 'Titan', value: 'titan' },
              { label: 'Express', value: 'express' },
              { label: 'Favorites', value: 'favorites' },
            ]}
          />

          <Select
            label="Урок"
            value={lesson || ''}
            onChange={handleChangeLesson}
            options={lesson ? lessonOptions : []}
            selectMinWidth="120px"
            disabled={course === 'favorites'}
          />

          <UserButton />
        </div>
      </div>
      {settingsOpen && (
        <Settings
          settings={settings}
          onChange={handleSettingsChange}
          onClose={() => setSettingsOpen(false)}
        />
      )}
      <div className="p-8">
        {course && lesson !== null ? (
          <Lesson
            ref={lessonRef}
            key={`${course}_${lesson}`}
            course={course}
            lesson={lesson}
            settings={settings}
          />
        ) : (
          <FullPageSpinner />
        )}
      </div>

      <button
        type="button"
        className="group fixed bottom-0 right-0 z-10 block p-4"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <div className="rounded-full border border-gray5 bg-light-gray5 p-2 text-gray3 transition group-hover:border-dark-gray1 group-hover:text-dark-gray1">
          <HiArrowUp size={24} />
        </div>
      </button>
    </div>
  );
};

export default MainPage;
