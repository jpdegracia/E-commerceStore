import Link from "next/link";
import { createUser } from "../action"; 

export default function NewUserPage() {
  return (
    <div className="min-vh-100 bg-dark text-white pt-5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="container mt-5" style={{ maxWidth: '600px' }}>
        
        {/* Header Section */}
        <div className="mb-4 pb-3 border-bottom border-secondary d-flex justify-content-between align-items-center">
          <h2 className="fw-bold text-primary mb-0" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1.2rem' }}>
            Enlist New Pilot
          </h2>
          <Link href="/users" className="btn btn-outline-light btn-sm">
            &larr; Cancel
          </Link>
        </div>

        {/* Form Card */}
        <div className="card bg-secondary border-0 shadow-lg p-4" style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))'
        }}>
          {/* 
            This is the magic part! 
            When submitted, Next.js packages the inputs and sends them straight to your action.ts 
          */}
          <form action={createUser}>
            
            <div className="mb-3">
              <label className="form-label fw-bold text-light">Full Name</label>
              <input 
                type="text" 
                name="name" 
                className="form-control bg-white text-white border-secondary" 
                required 
                placeholder="e.g., Heero Yuy" 
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold text-light">Username</label>
              <input 
                type="text" 
                name="username" 
                className="form-control bg-white text-white border-secondary" 
                required 
                placeholder="GundamPilot99" 
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label fw-bold text-light">Email Address</label>
              <input 
                type="email" 
                name="email" 
                className="form-control bg-white text-white border-secondary" 
                required 
                placeholder="pilot@colony.com" 
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold text-light">Temporary Password</label>
              <input 
                type="password" 
                name="password" 
                className="form-control bg-white text-white border-secondary" 
                required 
                placeholder="••••••••" 
              />
              <div className="form-text text-warning small mt-1">
                Since you are manually creating this pilot, they will default to a standard "USER" clearance.
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 fw-bold py-2">
              Save Pilot to Roster
            </button>
            
          </form>
        </div>

      </div>
    </div>
  );
}