import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "../lib/db";
import Link from "next/link";
// Removed ShieldCheck from imports since we don't need it anymore
import { ShoppingCart, User as UserIcon, LogOut, Users } from "lucide-react";
import { disconnectPilot } from "../logout/action";

export default async function DashboardPage() {
  // 1. Get the session cookie
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("pilot_session");

  // 2. If there is no cookie, kick them out to the login page
  if (!userIdCookie) {
    redirect("/login");
  }

  // 3. Fetch the logged-in user's details
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userIdCookie.value) },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-vh-100 bg-dark text-white pt-5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      {/* 🚀 TOP NAVBAR 🚀 */}
      <nav className="navbar navbar-expand navbar-dark bg-dark border-bottom border-secondary fixed-top">
        <div className="container">
          {/* Haven System acts as the home/product hub now */}
          <Link href="/dashboard" className="navbar-brand fw-bold text-warning text-decoration-none" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1rem' }}>
            HAVEN SYSTEM
          </Link>

          {/* Right side navigation items */}
          <div className="d-flex align-items-center gap-3 gap-md-4 ms-auto">
            
            <Link href="/orders" className="text-warning text-decoration-none" title="Active Hangar (Orders)">
              <ShoppingCart size={24} />
            </Link>
            
            <Link href="/profile" className="text-info text-decoration-none" title="Pilot Profile">
              <UserIcon size={24} />
            </Link>

            {/* 🔵 ADMIN ONLY BUTTON 🔵 (Changed to primary blue instead of red) */}
            {user.roles === "ADMIN" && (
              <Link href="/users" className="btn btn-primary btn-sm fw-bold d-flex align-items-center gap-2">
                <Users size={16} /> 
                <span className="d-none d-md-inline">Manage Users</span>
              </Link>
            )}

            {/* Vertical Divider */}
            <div className="vr bg-secondary mx-1" style={{ width: '2px', height: '24px' }}></div>

            {/* Disconnect Button */}
            <form action={disconnectPilot}>
              <button type="submit" className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2">
                <LogOut size={16} /> 
                <span className="d-none d-md-inline">Disconnect</span>
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <div className="container mt-5 pt-4">
        {/* Welcome Banner */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="p-5 bg-secondary rounded shadow border border-secondary" style={{ 
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("https://img.freepik.com/free-vector/gradient-tech-futuristic-background_52683-74267.jpg")',
              backgroundSize: 'cover'
            }}>
              <h1 className="display-5 fw-bold text-white mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
                Welcome back, Pilot {user.name}!
              </h1>
              <p className="lead text-light mb-0">
                Authentication confirmed. Clearance level: <span className={user.roles === "ADMIN" ? "text-warning fw-bold" : "text-success fw-bold"}>{user.roles}</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Product Grid Placeholder */}
        <div className="row">
          <div className="col-12">
            <div className="p-5 border border-secondary border-dashed rounded text-center" style={{ borderStyle: 'dashed' }}>
              <h3 className="text-white mb-3" style={{ fontFamily: "'Anton', sans-serif", letterSpacing: "1px" }}>
                Available Mobile Suits & Zoids
              </h3>
              <p className="text-muted mb-0">
                Incoming telemetry data... (The product cards and store inventory will render right here!)
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}