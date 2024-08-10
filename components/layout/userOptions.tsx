"use client";

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useAuthContext } from '@/contexts/authContext';
import { useToast } from '@/contexts/toastContext';

export default function UserOptions() {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const { userInfo, setUserInfo } = useAuthContext();
  const { showInfo } = useToast();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    }
  }, [dropdownRef]);

  async function handleLogout() {
    await fetch('/api/auth/signout', { method: 'POST' });
    showInfo("Sign-out successful", "You have successfully signed out.");
    setUserInfo(null);
    setIsDropdownOpen(false);
  }

  return (
    <>
      {userInfo ? (
        <div className="relative inline-block" ref={dropdownRef}>
          <button
            className={`
              text-white gap-2 p-1 bg-slate-600 rounded-lg inline-flex items-center px-3 hover:bg-slate-700 hover:cursor-pointer
              ${isDropdownOpen ? 'border border-2 border-stone-500' : 'border border-2 border-transparent'}
            `}
            onClick={() => {setIsDropdownOpen(!isDropdownOpen)}}
          >
            <svg className="feather feather-user" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>{userInfo.nickname}</span>
          </button>
          {isDropdownOpen && (
            <div className="absolute text-black divide-y divide-gray-100 right-0 z-10 bg-white rounded-lg shadow">
              <div className="block grid gap-y-4 py-4 px-4">
                <p className="text-sm font-bold text-center">{userInfo.email}</p>
                <p className="text-base mb-2">Hi, <span className="italic">{userInfo.nickname}</span>!</p>
              </div>
              <Link
                href="/account"
                className="block px-4 py-2 text-base hover:bg-gray-100"
                onClick={() => {setIsDropdownOpen(false)}}
              >
                My account
              </Link>
              <a onClick={handleLogout} className="block px-4 py-2 text-base hover:bg-gray-100 hover:cursor-pointer rounded-b-lg">
                Logout
              </a>
            </div>
          )}
        </div>
      ) : (
        <Link className="button login-button" href="/signin">
          Login
        </Link>
      )}
    </>
  )
}