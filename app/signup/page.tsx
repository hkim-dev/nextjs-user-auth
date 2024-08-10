"use client";

import { FormEvent } from "react";
import { useRouter } from 'next/navigation';
import authService from "@/lib/auth/authService";
import { useToast } from "@/contexts/toastContext";

interface SignUpFormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
  confirmPassword: HTMLInputElement;
}

interface SignInForm extends HTMLFormElement {
  readonly elements: SignUpFormElements;
}

export default function SignUp() {
  const { showError, showWarning } = useToast();
  const router = useRouter();

  async function handleSubmit(event: FormEvent<SignInForm>) {
    event.preventDefault();
    const { email, password, confirmPassword } = event.currentTarget.elements as unknown as Record<string, HTMLInputElement>;
    try {
      if (verifyInputs(email.value, password.value, confirmPassword.value)){
        await authService.signUp(email.value, password.value);
        sessionStorage.setItem('username', email.value);
        router.push('/signup/confirm');
      }
    } catch(error: any) {
      showError(error.name, error.message);
    }
  }

  function verifyInputs(email: string, password: string, confirmPassword: string): boolean {
    if (!email.includes('@') || !password || !confirmPassword || password !== confirmPassword) {
      showWarning("Invalid Values", "Please check your email and password again.");
      return false;
    }
    return true;
  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl pb-5 font-bold text-center">Sign Up</h1>
        <p className="text-center pb-3">Welcome to Battle Commander!</p>
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
          <div className="flex flex-col w-[80%]">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="mt-1 p-2 w-full text-gray-600 border border-gray-300 rounded-md w-full"
              placeholder="Confirm your password"
            />
          </div>
          <button
            type="submit"
            className="w-[80%] p-2 mt-7 bg-gradient-to-r from-lime-400 to-blue-500 text-white font-semibold rounded-full hover:from-lime-500 hover:to-blue-600"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  )
}