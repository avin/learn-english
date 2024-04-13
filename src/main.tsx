import React from 'react';
import ReactDOM from 'react-dom/client';
import MainPage from '@/components/pages/MainPage/MainPage.tsx';
import './styles.css';
import betterFocus from '@/utils/betterFocus.ts';

// Делаем фокус только по табу
const focusEngine = betterFocus(document.documentElement, 'focus-disabled');
focusEngine.start();

ReactDOM.createRoot(document.getElementById('root')!).render(<MainPage />);
