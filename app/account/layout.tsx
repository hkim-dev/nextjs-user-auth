import React from "react";
import Sidebar from "@/components/sidebar/sidebar";

export default function MyAccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="p-10 px-20 pt-20 w-full bg-slate-50">
        {children}
      </div>
    </div>
  )
}