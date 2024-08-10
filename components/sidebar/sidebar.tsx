"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { useAuthContext } from "@/contexts/authContext";
import { useToast } from "@/contexts/toastContext";
import SidebarData from "./sidebarData";

import '@/styles/sidebar.css'

export default function Sidebar () {
  const router = useRouter();
  const { userInfo, setUserInfo } = useAuthContext();
  const { showInfo } = useToast();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [clickedItem, setClickedItem] = useState<number>(0);

  async function handleLogout() {
    await fetch('/api/auth/signout', { method: 'POST' });
    router.push('/');
    showInfo("Sign-out successful", "You have successfully signed out.");
    setUserInfo(null);
  }

  return (
    <div className={`
      sidebar ${isOpen? 'open' : 'closed'}
      relative flex flex-col justify-between items-center gap-1 bg-slate-100 rounded-lg
    `}>
      <div className="top-section flex items-center justify-center px-2 w-full gap-2 mt-5">
        <span className="image">
          <Image
            src="/assets/gray_scale_icon.png"
            alt="battle cmd icon"
            height={30}
            width={30}
            className='logo'
          />
        </span>
        <div className={`text logo-text ${isOpen ? '' : 'hidden'}`}>
          <span className="website-name text-sm font-bold">Battle Commander</span>
        </div>
        <button className="toggle p-2 text-2xl rounded-full hover:bg-slate-100" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaArrowRight/> : <FaArrowLeft />}
        </button>
      </div>
      <div className='sidebar-items w-full flex flex-col items-center mt-auto'>
        {SidebarData.map(sideitem => {
          return (
            <div
              key={sideitem.id}
              className={`
                side-item flex w-full gap-2 items-center justify-center p-3 cursor-pointer hover:bg-neutral-200
                ${clickedItem === sideitem.id ? 'bg-neutral-200 active' : ''}
                ${isOpen ? 'px-5' : ''}
              `}
              onClick={() => setClickedItem(sideitem.id)}
            > 
              {isOpen ? (
                <a
                  className="text"
                  href={sideitem.id !== 4 ?sideitem.link : undefined}
                  onClick={sideitem.id === 4 ? handleLogout : undefined}
                >
                  {sideitem.text}
                </a>
              ) : (
                <a
                  className="icon text-lg"
                  href={sideitem.id !== 4 ?sideitem.link : undefined}
                  onClick={sideitem.id === 4 ? handleLogout : undefined}
                >
                  {sideitem.icon}
                </a>
              )}
            </div>
          )
        })}
      </div>
      <div className="bottom-section flex flex-col items-center gap-3 mt-auto w-full">
        <hr className="divider my-4" />
        <div className='user-info text-sm font-bold p-3 rounded-lg'>
          {isOpen ? userInfo?.nickname : <FaCircleUser className="text-lg" />}
        </div>
      </div>
    </div>
  )
}