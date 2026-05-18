import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./components/Navbar"; 
import SessionWrapper from "./components/Providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Haven System",
  description: "EFSF Pilot Hangar",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-dark text-white">
        <SessionWrapper>
          
          {/* 🚀 Look how clean this is! The Navbar manages its own visibility now */}
          <Navbar />
          
          {/* We add pt-5 directly to pages that need it now, so the layout stays simple */}
          <main>
            {children}
          </main>

        </SessionWrapper>
      </body>
    </html>
  );
}