import React, { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import Spinner from '@/components/common/Spinner/Spinner.tsx';
import { auth } from '@/firebase-config.ts';

interface Props {}

const LoginPage = ({}: Props) => {
  const [isInProgress, setIsInProgress] = useState(false);

  const handleClickGoogle = async () => {
    try {
      setIsInProgress(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      setIsInProgress(false);
    }
  };

  return (
    <div className="flex h-full items-center justify-center">
      <div className="border border-gray3 bg-white">
        <div className="border-b border-gray3 bg-light-gray3 p-2">English-Learn</div>
        <div className="relative p-8">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleClickGoogle}
              className="flex items-center space-x-2 border border-gray3 p-2"
            >
              <FaGoogle /> <span>Auth with Google</span>
            </button>
          </div>

          {isInProgress && (
            <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-white">
              <Spinner size={40} color="#5c7080"/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
