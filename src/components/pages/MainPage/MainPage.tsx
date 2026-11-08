import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HiArrowUp, HiOutlineCog } from 'react-icons/hi';
import { TbDeviceGamepad2, TbKeyboard } from 'react-icons/tb';
import Button from '@/components/common/Button/Button.tsx';
import FullPageSpinner from '@/components/common/FullPageSpinner/FullPageSpinner.tsx';
import Select from '@/components/common/Select/Select.tsx';
import UserButton from '@/components/common/UserButton/UserButton.tsx';
import About from '@/components/pages/MainPage/About.tsx';
import ControlsHelp from '@/components/pages/MainPage/ControlsHelp.tsx';
import Lesson, {
  LessonChangeCue,
  LessonControls,
} from '@/components/pages/MainPage/Lesson/Lesson.tsx';
import Settings from '@/components/pages/MainPage/Settings.tsx';
import { Course } from '@/types';
import { useProgressStorage } from '@/utils/ProgressContext.ts';
import { ProgressError } from '@/utils/progress.ts';
import { AppSettings, loadSettings, saveSettings } from '@/utils/settings.ts';
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

interface Props {
  isLocal: boolean;
  onLogin?: () => void;
  storageError: ProgressError | null;
}

const MainPage = ({ isLocal, onLogin, storageError }: Props) => {
  const { loadLastCourse, loadLastLesson, saveLastCourse, saveLastLesson, retrySaving } =
    useProgressStorage();
  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<string | null>(null);
  const [settings, setSettings] = useState(loadSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const lessonRef = useRef<LessonControls>(null);
  const [resumeTv, setResumeTv] = useState<{ fullscreen: boolean; cue: LessonChangeCue } | null>(
    null,
  );
  const lessonCue = useRef<HTMLAudioElement | null>(null);
  useEffect(() => () => lessonCue.current?.pause(), []);

  const playLessonCue = useCallback((cue: LessonChangeCue) => {
    lessonCue.current?.pause();
    const audio = new Audio(`${import.meta.env.BASE_URL}${cue}`);
    lessonCue.current = audio;
    void audio.play().catch(console.error);
  }, []);

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
    let active = true;
    if (course === null) {
      void loadLastCourse().then((course) => {
        if (active) setCourse(course);
      });
    }

    if (course && !lesson) {
      void loadLastLesson(course).then((lesson) => {
        if (!active) return;
        if (lessonOptions.some((option) => option.value === lesson)) {
          setLesson(lesson);
        } else {
          setLesson(lessonOptions[0]?.value || '');
        }
      });
    }
    return () => {
      active = false;
    };
  }, [course, lesson, lessonOptions, loadLastCourse, loadLastLesson]);

  const handleChangeCourse = (val: string) => {
    const course = val as Course;
    setCourse(course);
    setLesson(null);

    void saveLastCourse(course);
  };

  const handleChangeLesson = useCallback(
    (val: string) => {
      if (!course || val === lesson) return;
      const currentIndex = lessonOptions.findIndex((option) => option.value === lesson);
      const nextIndex = lessonOptions.findIndex((option) => option.value === val);
      const cue =
        nextIndex > currentIndex ? 'sounds/lesson-next.wav' : 'sounds/lesson-previous.wav';
      const tv = lessonRef.current?.getTvResume();
      if (tv) setResumeTv({ ...tv, cue });
      else playLessonCue(cue);
      setLesson(val);

      void saveLastLesson(course, val);
    },
    [course, lesson, lessonOptions, playLessonCue, saveLastLesson],
  );

  const changeAdjacentLesson = useCallback(
    (direction: number) => {
      const index = lessonOptions.findIndex((option) => option.value === lesson);
      if (index === -1) return;
      const next = lessonOptions[index + direction];
      if (next) handleChangeLesson(next.value);
      else if (!lessonRef.current?.playTvBoundaryCue())
        playLessonCue('sounds/lesson-unavailable.wav');
    },
    [handleChangeLesson, lesson, lessonOptions, playLessonCue],
  );

  useGamepad(
    (action) => {
      if (lessonRef.current?.handleTvGamepad(action)) return;
      if (action === 'previousLesson' || action === 'nextLesson') {
        changeAdjacentLesson(action === 'nextLesson' ? 1 : -1);
      } else if (action === 'replay') {
        lessonRef.current?.replay();
      } else if (action === 'restart') {
        lessonRef.current?.restart();
      } else if (action === 'toggleDictionary') {
        lessonRef.current?.toggleDictionary();
      } else {
        lessonRef.current?.navigate(action);
      }
    },
    settings.gamepadEnabled,
    !course || lesson === null || settingsOpen || helpOpen || aboutOpen || !!resumeTv,
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
        resumeTv ||
        settingsOpen ||
        helpOpen ||
        document.querySelector('dialog[open]') ||
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
  }, [changeAdjacentLesson, course, helpOpen, lesson, lessonOptions, resumeTv, settingsOpen]);

  const handleSettingsChange = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  if (!course) {
    return <FullPageSpinner />;
  }

  return (
    <div>
      {resumeTv && (
        <div data-tv-loading="" aria-hidden="true" className="fixed inset-0 z-50 bg-white" />
      )}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray3 bg-light-gray3 px-3 py-2 sm:gap-4 sm:px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-gray-500 text-lg font-bold">
            <button type="button" onClick={() => setAboutOpen(true)} aria-haspopup="dialog">
              Тренажёр перевода
            </button>
          </h1>
          <Button
            onClick={() => setHelpOpen(true)}
            intent="outline"
            className="flex h-8 items-center gap-2"
            aria-label="Справка по управлению"
            aria-haspopup="dialog"
            aria-expanded={helpOpen}
            aria-controls="controls-help"
            title="Справка по управлению"
          >
            <TbKeyboard size={20} aria-hidden="true" />
            <span aria-hidden="true">+</span>
            <TbDeviceGamepad2 size={20} aria-hidden="true" />
          </Button>
        </div>
        <div className="flex w-full flex-wrap items-center justify-start gap-3 sm:w-auto sm:justify-end sm:gap-4">
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

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setSettingsOpen(true)}
              intent="outline"
              className="flex h-8 w-8 items-center justify-center"
              aria-label="Настройки"
              title="Настройки"
            >
              <HiOutlineCog size={18} aria-hidden="true" />
            </Button>
            {onLogin && <UserButton isLocal={isLocal} onLogin={onLogin} />}
          </div>
        </div>
      </header>
      {storageError && (
        <div
          role="alert"
          className="flex flex-wrap items-center gap-3 border-b border-red1 bg-white px-4 py-3 text-sm text-red1"
        >
          <p className="max-w-3xl">{storageError.message}</p>
          <Button
            intent="outline"
            onClick={() =>
              storageError.type === 'load' ? window.location.reload() : void retrySaving()
            }
          >
            {storageError.type === 'load' ? 'Обновить страницу' : 'Повторить сохранение'}
          </Button>
        </div>
      )}
      {helpOpen && <ControlsHelp onClose={() => setHelpOpen(false)} />}
      {aboutOpen && <About onClose={() => setAboutOpen(false)} />}
      {settingsOpen && (
        <Settings
          settings={settings}
          onChange={handleSettingsChange}
          onClose={() => setSettingsOpen(false)}
        />
      )}
      <div className="px-3 py-5 sm:p-8">
        {course && lesson !== null ? (
          <Lesson
            ref={lessonRef}
            key={`${course}_${lesson}`}
            course={course}
            lesson={lesson}
            lessonTitle={lessonOptions.find((option) => option.value === lesson)?.label ?? lesson}
            resumeTv={resumeTv}
            onTvResumed={() => setResumeTv(null)}
            onAdjacentLesson={changeAdjacentLesson}
            settings={settings}
            onSwapDirection={() =>
              handleSettingsChange({
                ...settings,
                sourceLanguage: settings.sourceLanguage === 'ru' ? 'en' : 'ru',
              })
            }
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
