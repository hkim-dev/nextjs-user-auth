// author: Hyemin Kim (hyemin@episyscience.com)

"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent } from "react";
import { useToast } from '@/contexts/toastContext';
import { useAuthContext } from '@/contexts/authContext';
import GoogleLoginButton from '@/components/socialLogin/googleLoginButton';

interface SignInFormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
}

interface SignInForm extends HTMLFormElement {
  readonly elements: SignInFormElements;
}

export default function SignIn() {
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const { getUserStatus } = useAuthContext();

  async function handleSubmit(event: FormEvent<SignInForm>) {
    event.preventDefault();
    const form = event.currentTarget;
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: form.elements.email.value,
        password: form.elements.password.value
      })
    })
    if (response.ok) {
      showSuccess("Login Successful", "You're now signed in.");
      getUserStatus();
      router.push('/');
    } else {
      const errorResponse = await response.json();
      showError("Login Unsuccessful", errorResponse.error.message);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl pb-5 font-bold text-center">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col w-full items-center justify-center">
          <div className="flex flex-col w-[80%] mb-2">
            <label htmlFor="email" className="text-sm text-gray-600 font-medium w-full">Email:</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Type your email address"
              className="mt-1 p-2 w-full text-gray-600 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col w-[80%]">
            <label htmlFor="password" className="text-sm text-gray-600 font-medium w-full">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 p-2 w-full text-gray-600 border border-gray-300 rounded-md w-full"
              placeholder="Type your password"
            />
          </div>
          <div className="flex justify-end mb-6 w-[80%]">
            <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
          </div>
          <button
            type="submit"
            className="w-[80%] p-2 bg-gradient-to-r from-blue-400 to-purple-500 text-white font-semibold rounded-full hover:from-blue-500 hover:to-purple-600"
          >
            Login
          </button>
        </form>
        <div className="text-center text-sm text-gray-600 mt-4">
          Or
        </div>
        <div className="flex flex-col items-center gap-2 justify-center mt-4">
          <GoogleLoginButton />
        </div>
      </div>
      <div className="mt-3 text-gray-600">
        New to our website?{' '}
        <span className="text-blue-600 hover:underline">
          <Link href="/signup">
            Join now
          </Link>
        </span>
      </div>
    </div>
  )
}