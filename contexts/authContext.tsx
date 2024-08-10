"use client";

import React, { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { userInfo } from '@/customTypes/auth';

interface AuthContextProps {
  userInfo: null | userInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<null | userInfo>>;
  getUserStatus: () => void;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export function useAuthContext(): AuthContextProps {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within a AuthProvier.');
  }
  return context;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState<null | userInfo>(null);

  useEffect(() => {
    if (getSessionId()) {
      getUserStatus();
    }
  }, []);

  function getSessionId() {
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith('sessionId='))
      ?.split('=')[1];
    return cookieValue;
  }

  async function getUserStatus() {
    try {
      const response = await fetch('/api/users/me', { method: 'GET' });
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setUserInfo(data.user);
    } catch (error) {
      throw new Error("Failed to check the authentication status. Please contact the customer service for assistance.");
    }
  }

  const contextValue = {
    userInfo,
    setUserInfo,
    getUserStatus
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}