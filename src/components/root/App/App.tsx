import React, { useEffect, useState } from 'react';
import { User } from '@firebase/auth';
import FullPageSpinner from '@/components/common/FullPageSpinner/FullPageSpinner.tsx';
import LoginPage from '@/components/pages/LoginPage/LoginPage.tsx';
import MainPage from '@/components/pages/MainPage/MainPage.tsx';
import { auth } from '@/firebase-config.ts';

interface Props {}

const App = ({}: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Эта функция вызывается каждый раз, когда состояние аутентификации изменяется
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    // Отписываемся от слушателя при размонтировании компонента
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <FullPageSpinner />;
  }

  if (user) {
    return <MainPage />;
  }

  return <LoginPage />;
};

export default App;
