"use client"; // 🚀 Needs to be a client component to use the signOut function

import Link from "next/link";
import { ShoppingCart, User as UserIcon, Users, LogOut } from "lucide-react";
import { Role } from "../generated/prisma/enums";
import { signOut } from "next-auth/react"; // 🚀 Import NextAuth's signOut

// Update the props to expect the NextAuth user type
type NavbarProps = {
  user: {
    id: string;
    roles: Role; 
    name?: string | null;
    email?: string | null;
  };
};

export default function Navbar({ user }: NavbarProps) {
  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark border-bottom border-secondary fixed-top">
      <div className="container">
        <Link href="/dashboard" className="navbar-brand fw-bold text-warning text-decoration-none" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1rem' }}>
          HAVEN SYSTEM
        </Link>

        <div className="d-flex align-items-center gap-3 gap-md-4 ms-auto">
          
          <Link href="/orders" className="text-warning text-decoration-none" title="Active Hangar (Orders)">
            <ShoppingCart size={24} />
          </Link>
          
          <Link href="/profile" className="text-info text-decoration-none" title="Pilot Profile">
            <UserIcon size={24} />
          </Link>

          {/* 🔵 ADMIN ONLY BUTTON 🔵 (Now fully type-safe!) */}
          {user.roles === "ADMIN" && (
            <Link href="/users" className="btn btn-primary btn-sm fw-bold d-flex align-items-center gap-2">
              <Users size={16} /> 
              <span className="d-none d-md-inline">Manage Users</span>
            </Link>
          )}

          <div className="vr bg-secondary mx-1" style={{ width: '2px', height: '24px' }}></div>

          {/* 🚀 Replaced custom action with NextAuth signOut */}
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