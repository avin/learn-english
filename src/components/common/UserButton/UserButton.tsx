import React, { useState } from 'react';
import { HiOutlineLogin, HiOutlineLogout } from 'react-icons/hi';
import Button from '@/components/common/Button/Button.tsx';
import { auth } from '@/firebase-config.ts';
import { useProgressStorage } from '@/utils/ProgressContext.ts';

interface Props {
  isLocal: boolean;
  onLogin: () => void;
}

const UserButton = ({ isLocal, onLogin }: Props) => {
  const { hasUnsavedChanges, retrySaving } = useProgressStorage();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const handleClickLogout = async () => {
    if (!window.confirm('Выйти из аккаунта?')) return;
    setBusy(true);
    setError(false);
    try {
      await retrySaving();
      if (hasUnsavedChanges()) return;
      await auth.signOut();
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
      setError(true);
    } finally {
      setBusy(false);
    }
  };

  const handleClickLogin = async () => {
    await retrySaving();
    if (!hasUnsavedChanges()) onLogin();
  };

  return (
    <div>
      <Button
        intent="outline"
        className="flex h-8 items-center gap-2 disabled:cursor-wait disabled:opacity-60"
        onClick={isLocal ? handleClickLogin : handleClickLogout}
        disabled={busy}
      >
        {isLocal ? (
          <HiOutlineLogin size={18} aria-hidden="true" />
        ) : (
          <HiOutlineLogout size={18} aria-hidden="true" />
        )}
        {isLocal ? 'Войти' : busy ? 'Выходим…' : 'Выход'}
      </Button>
      {error && (
        <p role="alert" className="mt-1 text-xs text-red1">
          Не удалось выйти. Попробуйте снова.
        </p>
      )}
    </div>
  );
};

export default UserButton;
