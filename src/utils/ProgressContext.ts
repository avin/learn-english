import { createContext, useContext } from 'react';
import { ProgressStorage } from '@/utils/progress.ts';

export const ProgressContext = createContext<ProgressStorage | null>(null);

export const useProgressStorage = () => {
  const storage = useContext(ProgressContext);
  if (!storage) throw new Error('Progress storage is unavailable outside a learning session');
  return storage;
};
