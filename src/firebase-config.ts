import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: 'AIzaSyAnx-2_hPh3uHa03Khd1zjNTgRtrlID3x0',
  authDomain: 'learn-english-e8e0f.firebaseapp.com',
  projectId: 'learn-english-e8e0f',
  storageBucket: 'learn-english-e8e0f.appspot.com',
  messagingSenderId: '1016778087191',
  appId: '1:1016778087191:web:edef0ba5847872c6a2f552',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

