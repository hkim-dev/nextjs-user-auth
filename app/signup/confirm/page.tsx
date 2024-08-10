"use client";

import { FormEvent } from "react";
import { useRouter } from 'next/navigation';
import authService from "@/lib/auth/authService";
import { useToast } from "@/contexts/toastContext";

interface CodeConfirmFormElements extends HTMLFormControlsCollection {
  code: HTMLInputElement
}

interface CodeConfirmForm extends HTMLFormElement {
  readonly elements: CodeConfirmFormElements
}

export default function Confirm () {
  const router = useRouter();
  const { showError, showSuccess } = useToast();

  async function handleSubmit(event: FormEvent<CodeConfirmForm>) {
    event.preventDefault();
    const form = event.currentTarget;
    const username = sessionStorage.getItem('username');
    if (!username) {
      showError('Invalid username', 'Username is missing or invalid.');
      return;
    }

    try {
      await authService.confirmSignUp(username, form.elements.code.value);
      showSuccess('Confirmation Successful', 'Your email address has been verified. Please log in to your account.');
      router.push('/signin');
    } catch(error: any) {
      showError(error.name, error.message);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl pb-7 font-bold text-center">
          Confirm Your Email Address
        </h1>
        <p className="mb-5 text-wrap">
          We emailed you with the confirmation code. For security reasons, the code expires in 24 hours.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col w-full items-center justify-center">
          <div className="flex flex-col w-[80%] mb-2">
            <input
              type="text"
              id="code"
              name="code"
              placeholder="Type your confirmation code"
              className="mt-1 p-2 w-full text-gray-600 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-[80%] p-2 bg-gradient-to-r from-lime-400 to-blue-500 text-white font-semibold rounded-full hover:from-lime-500 hover:to-blue-600"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  )
}