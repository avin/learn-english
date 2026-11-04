import React, { useEffect, useRef, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/firebase-config.ts';
import './LoginPage.css';

interface Props {
  onLocal: () => void;
  initialError: string | null;
}

const googleErrorMessage = (error: unknown) => {
  const code = (error as { code?: string })?.code;
  switch (code) {
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return null;
    case 'auth/popup-blocked':
      return 'Браузер заблокировал окно Google. Разрешите всплывающие окна для этого сайта и попробуйте снова.';
    case 'auth/network-request-failed':
      return 'Не удалось связаться с Google. Проверьте подключение к интернету и попробуйте снова.';
    default:
      return 'Не удалось войти через Google. Попробуйте снова или выберите локальный режим.';
  }
};

const GoogleMark = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.23c1.89-1.74 2.99-4.3 2.99-7.36Z"
    />
    <path
      fill="#34A853"
      d="M12 22c2.7 0 4.96-.9 6.61-2.41l-3.23-2.51c-.9.6-2.05.96-3.38.96-2.61 0-4.83-1.76-5.62-4.12H3.04v2.59A10 10 0 0 0 12 22Z"
    />
    <path
      fill="#FBBC05"
      d="M6.38 13.92A6 6 0 0 1 6.06 12c0-.67.11-1.32.32-1.92V7.49H3.04A10 10 0 0 0 2 12c0 1.61.39 3.14 1.04 4.51l3.34-2.59Z"
    />
    <path
      fill="#EA4335"
      d="M12 5.96c1.47 0 2.79.51 3.82 1.51l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.96 5.49l3.34 2.59C7.17 7.72 9.39 5.96 12 5.96Z"
    />
  </svg>
);

const LoginPage = ({ onLocal, initialError }: Props) => {
  const [error, setError] = useState(initialError);
  const attemptId = useRef(0);

  useEffect(
    () => () => {
      attemptId.current++;
    },
    [],
  );

  const handleClickGoogle = async () => {
    const currentAttempt = ++attemptId.current;
    setError(null);
    try {
      // Firebase cancels an earlier popup when a new attempt starts. Its closure
      // notification may be delayed, so the main page must remain usable.
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      if (currentAttempt === attemptId.current) setError(googleErrorMessage(error));
    }
  };

  const handleClickLocal = () => {
    attemptId.current++;
    setError(null);
    try {
      onLocal();
    } catch {
      setError(
        'Браузер не разрешает сохранять прогресс. Разрешите хранение данных для этого сайта в настройках браузера или войдите через Google.',
      );
    }
  };

  return (
    <main className="welcome-page">
      <section className="welcome-card" aria-labelledby="welcome-title">
        <h1 id="welcome-title">Тренажёр перевода</h1>
        <p className="welcome-description">
          Переводите фразы с русского на английский по курсам{' '}
          <a
            href="https://www.youtube.com/@englishplaylists/playlists"
            target="_blank"
            rel="noreferrer"
          >
            «Английский по плейлистам»
          </a>
          .
        </p>

        <div className="welcome-option">
          <button
            type="button"
            className="welcome-action welcome-action-google"
            onClick={handleClickGoogle}
            aria-describedby="google-mode-description"
          >
            <span className="welcome-google-mark">
              <GoogleMark />
            </span>
            Войти через Google
          </button>
          <p id="google-mode-description" className="welcome-option-description">
            Прогресс и избранное сохраняются в аккаунте и доступны на других устройствах.
          </p>
        </div>

        <div className="welcome-option welcome-local">
          <button
            type="button"
            className="welcome-action welcome-action-local"
            onClick={handleClickLocal}
            aria-describedby="local-mode-description"
          >
            Работать локально
          </button>
          <p id="local-mode-description" className="welcome-option-description">
            Прогресс хранится только в этом браузере. При очистке данных сайта или закрытии
            приватного окна он пропадёт. В аккаунт Google он не переносится.
          </p>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {error && (
            <p className="welcome-error" role="alert">
              {error}
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
