import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/db";
import { updateUser } from "../../action";

// Next.js passes the URL parameters into this component
export default async function updateUserPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Await the params to get the ID from the URL
  const resolvedParams = await params;
  const userId = parseInt(resolvedParams.id);

  // 2. Fetch the specific pilot from the DB
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  // 3. If they typed a fake ID in the URL, kick them back to the roster
  if (!user) {
    redirect("/users");
  }

  return (
    <div className="min-vh-100 bg-dark text-white pt-5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="container mt-5" style={{ maxWidth: '600px' }}>
        
        {/* Header Section */}
        <div className="mb-4 pb-3 border-bottom border-secondary d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-bold text-info mb-0" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1.2rem' }}>
              Update Pilot Data
            </h2>
            <p className="text-muted small mt-2 mb-0">Editing ID: {user.id}</p>
          </div>
          <Link href="/users" className="btn btn-outline-light btn-sm">
            &larr; Cancel
          </Link>
        </div>

        {/* Form Card */}
        <div className="card bg-secondary border-0 shadow-lg p-4" style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))'
        }}>
          <form action={updateUser}>
            
            {/* 🚀 CRITICAL: Hidden input passes the ID to the server action! */}
            <input type="hidden" name="id" value={user.id} />

            <div className="mb-3">
              <label className="form-label fw-bold text-light">Full Name <span className="text-danger">*</span></label>
              <input 
                type="text" 
                name="name" 
                defaultValue={user.name || ""} 
                className="form-control bg-white text-dark border-secondary" 
                required 
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold text-light">Username <span className="text-danger">*</span></label>
              <input 
                type="text" 
                name="username" 
                defaultValue={user.username || ""} 
                className="form-control bg-white text-warning border-secondary fw-bold" 
                required 
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label fw-bold text-light">Email Address <span className="text-danger">*</span></label>
              <input 
                type="email" 
                name="email" 
                defaultValue={user.email || ""} 
                className="form-control bg-white text-dark border-secondary" 
                required 
              />
            </div>

            {/* Clearance Level / Role Selector */}
            <div className="mb-4">
              <label className="form-label fw-bold text-light">Role <span className="text-danger">*</span></label>
              <select 
                name="roles" 
                defaultValue={user.roles || "USER"} 
                className="form-select bg-white text-dark border-secondary"
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <button type="submit" className="btn btn-info w-100 fw-bold py-2 text-dark">
              Update 
            </button>
            
          </form>
        </div>

      </div>
    </div>
  );
}