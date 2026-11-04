import { doc, getDoc, setDoc } from 'firebase/firestore/lite';
import { db } from '@/firebase-config.ts';
import {
  ProgressData,
  ProgressError,
  createLocalProgressAdapter,
  createProgressStorage,
} from '@/utils/progress.ts';

// The destination belongs to this session. Pending writes cannot switch accounts or modes.
export const createStorage = (
  userId: string | null,
  onError: (error: ProgressError | null) => void,
) => {
  if (!userId) return createProgressStorage(createLocalProgressAdapter(), onError);

  const reference = doc(db, 'users', userId);

  return createProgressStorage(
    {
      async read() {
        const snapshot = await getDoc(reference);
        return snapshot.exists() ? (snapshot.data() as ProgressData) : {};
      },
      patch: (data) => setDoc(reference, data, { merge: true }),
    },
    onError,
    'cloud',
  );
};
