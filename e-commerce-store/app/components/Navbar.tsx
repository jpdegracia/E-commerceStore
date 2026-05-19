"use client"; 

import Link from "next/link";
import { ShoppingCart, User as UserIcon, Users, LogOut, ShieldAlert } from "lucide-react";
import { signOut, useSession } from "next-auth/react"; // 🚀 Import useSession

export default function Navbar() {
  // 🚀 Tell the Navbar to listen to the live session state!
  const { data: session, status } = useSession();

  // If the user is not logged in, return nothing (hide the Navbar)
  if (status !== "authenticated" || !session?.user) {
    return null;
  }

  // Extract the user from the live session
  const user = session.user;

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark border-bottom border-secondary fixed-top">
      <div className="container">
        <Link href="/dashboard" className="navbar-brand fw-bold text-warning text-decoration-none" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1rem' }}>
          HAVEN SYSTEM
        </Link>

        <div className="d-flex align-items-center gap-3 gap-md-4 ms-auto">
          
          <Link href="/cart" className="text-warning text-decoration-none" title="Active Orders">
            <ShoppingCart size={24} />
          </Link>
          
          <Link href="/profile" className="text-info text-decoration-none" title="Pilot Profile">
            <UserIcon size={24} />
          </Link>

          {/* 🔵 ADMIN ONLY BUTTON 🔵 */}
          {user.roles === "ADMIN" && (
            <Link href="/admin" className="btn btn-primary btn-sm fw-bold d-flex align-items-center gap-2">
              <ShieldAlert size={16} /> {/* Swapped icon for a shield */}
              <span className="d-none d-md-inline">Command Center</span>
            </Link>
          )}

          <div className="vr bg-secondary mx-1" style={{ width: '2px', height: '24px' }}></div>

          <button 
            onClick={() => signOut({ callbackUrl: '/login' })} 
            className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2"
          >
            <LogOut size={16} /> 
            <span className="d-none d-md-inline">Disconnect</span>
          </button>
          
        </div>
      </div>
    </nav>
  );
}