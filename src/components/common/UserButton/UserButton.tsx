import React from 'react';
import { auth } from '@/firebase-config.ts';

interface Props {}

const UserButton = ({}: Props) => {
  const handleClickLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
    }
  };

  return (
    <div>
      <button type="button" onClick={handleClickLogout}>
        Logout
      </button>
    </div>
  );
};

export default UserButton;
