"use client";

import Link from "next/link";
import { useAuthContext } from "@/contexts/authContext";

export default function Account() {
  const { userInfo } = useAuthContext();

  return (
    <div className="flex flex-col space-y-10 items-center mb-10">
      <div className="space-y-2">
        <div className="text-xl text-gray-900 whitespace-pre-line break-all flex justify-left items-center">
          Hi,&nbsp;<span className="italic">{userInfo?.nickname}</span>!
        </div>
      </div>
      <div>
        <div className="text-sm text-gray-400">
          <strong>Battle Commander member since </strong>
          {userInfo?.created_at ? new Date(userInfo?.created_at).toLocaleDateString() : "N/A"}
          <p>
            <strong>Membership Duration: </strong>
            {userInfo?.created_at ? calculateDuration(new Date(userInfo?.created_at)) : "N/A"}
          </p>
        </div>
      </div>
      <div className="space-y-5">
        <div className="flex gap-5">
          <div className="flex-1">
            <div className="flex flex-col h-full justify-between rounded border border-gray-200">
              <div className="p-10">
                <div className="flex items-center">
                  <div className="text-lg text-gray-900 font-semibold">Your ID</div>
                  <div className="grow" />
                </div>
                <div className="mt-3 text-gray-500">{userInfo?.email}</div>
              </div>
              <div className="p-10 border-t border-t-gray-200">
                <Link
                  href="/account/settings"
                  className="underline"
                >
                  Manage your account settings
                </Link>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-col h-full justify-between rounded border border-gray-200">
              <div className="p-10">
                <div className="flex items-center">
                  <div className="text-lg text-gray-900 font-semibold">Protect your Account</div>
                  <div className="grow" />
                </div>
                <div className="mt-3 text-gray-500">
                  Enable 2-factor authentication to add an extra layer of security to your account.
                </div>
              </div>
              <div className="p-10 border-t border-t-gray-200">
                <Link
                  href="/account/security"
                  className="underline"
                >
                  Manage your account security
                  </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-4xl mt-10 relative">
        <div className="p-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg shadow-lg text-center text-white">
          <h2 className="text-3xl font-bold mb-2">Upgrade to Premium!</h2>
          <p className="mb-4">
            Unlock exclusive features and take your gaming skills to the next level with our AI Coach.
          </p>
          <Link
            href="/account/subscription"
            className="inline-block px-8 py-3 mt-2 bg-white text-blue-600 font-semibold rounded hover:bg-gray-100 transition"
          >
            Learn More
          </Link>
          <div className="absolute inset-0 flex justify-between items-center pointer-events-none">
            <div className="w-40 h-40 bg-blue-300 rounded-full opacity-30 transform -translate-x-1/4 -translate-y-1/4"></div>
            <div className="w-40 h-40 bg-indigo-300 rounded-full opacity-30 transform translate-x-1/4 translate-y-1/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateDuration(startDate: Date): string {
  const now = new Date();
  const diff = now.getTime() - startDate.getTime();

  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
  const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));

  return `${years} years, ${months} months, and ${days} days`;
}