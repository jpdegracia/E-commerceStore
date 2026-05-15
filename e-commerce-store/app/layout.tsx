import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./components/Navbar"; 
// 🚀 Import getServerSession and your authOptions
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import SessionWrapper from "./components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Haven System",
  description: "EFSF Pilot Hangar",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // 🚀 Fetch the active NextAuth session!
  const session = await getServerSession(authOptions);
  
  // Extract the user from the session (will be null if not logged in)
  const user = session?.user || null;

  return (
    <html lang="en">
      <body className="bg-dark text-white">
        {/* 🚀 Wrap everything in the Client Bridge */}
        <SessionWrapper>
          
          {user && <Navbar user={user} />}
          
          <main className={user ? "pt-5 mt-4" : ""}>
            {children}
          </main>

        </SessionWrapper>
      </body>
    </html>
  );
}