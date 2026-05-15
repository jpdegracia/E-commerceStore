import { redirect } from "next/navigation";
import { prisma } from "../lib/db";
import { getServerSession } from "next-auth";
// 🚀 Import your NextAuth config
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function DashboardPage() {
  // 1. Get the session securely via NextAuth
  const session = await getServerSession(authOptions);

  // 2. If there is no session, kick them out to the login page
  if (!session?.user?.id) {
    redirect("/login");
  }

  // 3. Fetch the logged-in user's details using the NextAuth session ID
  // (We use parseInt because we converted the ID to a string in the JWT token!)
  const user = await prisma.user.findUnique({
    where: { id: parseInt(session.user.id) },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    // Removed the pt-5 here because the layout.tsx is now handling the top padding!
    <div className="min-vh-100 bg-dark text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      
      {/* 🚀 Deleted the hardcoded Navbar from here because layout.tsx handles it now! 🚀 */}

      {/* Main Dashboard Content */}
      <div className="container">
        {/* Welcome Banner */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="p-5 bg-secondary rounded shadow border border-secondary" style={{ 
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("https://img.freepik.com/free-vector/gradient-tech-futuristic-background_52683-74267.jpg")',
              backgroundSize: 'cover'
            }}>
              <h1 className="display-5 fw-bold text-white mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
                Welcome back, Pilot {user.username}!
              </h1>
              <p className="lead text-light mb-0">
                Authentication confirmed.
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