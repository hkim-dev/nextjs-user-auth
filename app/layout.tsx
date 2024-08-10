import { Metadata } from 'next';
import { ReactNode } from 'react';
import Script from 'next/script';
import { reddit_mono } from '@/lib/ui/fonts';
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ToastProvider from "@/contexts/toastContext";
import AuthProvider from "@/contexts/authContext";
import "@/styles/globals.css";
import "@/styles/layout.css";
import "@/styles/toast.css";

export const metadata: Metadata = {
  title: 'Battle Commander',
  description: 'Website for Leauge users'
}

export default function RootLayout({
  children
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className={reddit_mono.className}>
      <body>
        <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" />
        <div className="__next flex flex-col min-h-screen">
          <ToastProvider>
            <AuthProvider>
              <Navbar />
              <main role="main" id="main">
                {children}
              </main>
              <Footer />
            </AuthProvider>
          </ToastProvider>
        </div>
      </body>
    </html>
  )
}