import React, { useEffect, useMemo, useState } from 'react';
import { User } from '@firebase/auth';
import FullPageSpinner from '@/components/common/FullPageSpinner/FullPageSpinner.tsx';
import LoginPage from '@/components/pages/LoginPage/LoginPage.tsx';
import MainPage from '@/components/pages/MainPage/MainPage.tsx';
import { auth } from '@/firebase-config.ts';
import { ProgressContext } from '@/utils/ProgressContext.ts';
import {
  ProgressError,
  clearLocalSession,
  hasLocalSession,
  startLocalSession,
} from '@/utils/progress.ts';
import { createStorage } from '@/utils/storage.ts';

const LearningSession = ({ userId, onLogin }: { userId: string | null; onLogin: () => void }) => {
  const [storageError, setStorageError] = useState<ProgressError | null>(null);
  const storage = useMemo(() => createStorage(userId, setStorageError), [userId]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!storage.hasUnsavedChanges()) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [storage]);

  return (
    <ProgressContext.Provider value={storage}>
      <MainPage isLocal={!userId} onLogin={onLogin} storageError={storageError} />
    </ProgressContext.Provider>
  );
};

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [localMode, setLocalMode] = useState(hasLocalSession);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        if (user) {
          clearLocalSession();
          setLocalMode(false);
        }
        setUser(user);
        setLoading(false);
      },
      () => {
        setAuthError('Не удалось проверить вход. Попробуйте войти снова или работайте локально.');
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, []);

  const handleLocal = () => {
    startLocalSession();
    setLocalMode(true);
  };

  const handleOpenLogin = () => {
    clearLocalSession();
    setLocalMode(false);
  };

  if (loading && !localMode) {
    return <FullPageSpinner />;
  }

  if (user || localMode) {
    return (
      <LearningSession
        key={user?.uid ?? 'local'}
        userId={user?.uid ?? null}
        onLogin={handleOpenLogin}
      />
    );
  }

  return <LoginPage onLocal={handleLocal} initialError={authError} />;
};

export default App;
