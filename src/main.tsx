import React from 'react';
import ReactDOM from 'react-dom/client';
import betterFocus from '@/utils/betterFocus.ts';
import './styles.css';
import './firebase-config.ts';
import App from '@/components/root/App/App.tsx';

// Делаем фокус только по табу
const focusEngine = betterFocus(document.documentElement, 'focus-disabled');
focusEngine.start();

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
