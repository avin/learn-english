import React from 'react';
import { HiOutlineLogout } from 'react-icons/hi';
import Button from '@/components/common/Button/Button.tsx';
import { auth } from '@/firebase-config.ts';

const UserButton = () => {
  const handleClickLogout = async () => {
    if (!window.confirm('Выйти из аккаунта?')) return;
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
    }
  };

  return (
    <Button intent="outline" className="flex h-8 items-center gap-2" onClick={handleClickLogout}>
      <HiOutlineLogout size={18} aria-hidden="true" />
      Выход
    </Button>
  );
};

export default UserButton;
