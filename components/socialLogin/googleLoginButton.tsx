"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useToast } from '@/contexts/toastContext';
import { useAuthContext } from '@/contexts/authContext';

export default function GoogleLoginButton () {
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const { getUserStatus } = useAuthContext();

  useEffect(() => {
    const { google } = window;
    if (google) {
      google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleCredentialResponse,
        ux_mode: 'popup',
      });
      google.accounts.id.renderButton(
        document.getElementById('loginWithGoogle')!,
        { theme: 'outline', size: 'large'}
      )
    }
  }, []);

  const handleCredentialResponse = async (response: any) => {
    const idToken = response.credential;
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: idToken }),
    });
    if (res.ok) {
      getUserStatus();
      showSuccess("Login Successful", "You've successfully signed in with Google.");
      router.push('/');
    } else {
      showError("Login Failed", "Authentication with Google failed. Please try again.");
    }
  };

  return <div id="loginWithGoogle" />;
}