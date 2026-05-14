import Link from "next/link";
import { loginCustomer } from "./action";

export default function LoginPage() {
  return (
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center bg-dark text-white" 
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://www.chromethemer.com/download/hd-wallpapers/gundam-3840x2160.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="card bg-dark border-secondary shadow-lg p-4" style={{ width: '100%', maxWidth: '400px' }}>
        
        <h2 className="text-center mb-4" style={{ fontFamily: '"Press Start 2P", cursive', color: '#ffd700', fontSize: '1.5rem' }}>
          SYSTEM LOGIN
        </h2>
        
        <form action={loginCustomer}>
          <div className="mb-3">
            <label className="form-label text-light fw-bold">Email Address</label>
            <input 
              type="email" 
              name="email" 
              placeholder="pilot@efsf.com"
              className="form-control bg-secondary text-white border-0" 
              required 
            />
          </div>
          
          <div className="mb-4">
            <label className="form-label text-light fw-bold">Password</label>
            <input 
              type="password" 
              name="password" 
              placeholder="••••••••"
              className="form-control bg-secondary text-white border-0" 
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="btn w-100 fw-bold py-2 mb-3" 
            style={{ background: '#1974D2', color: 'white', borderRadius: '50px' }}
          >
            Login
          </button>
          
          <div className="text-center mt-3 d-flex flex-column gap-2">
            <Link href="/signup" className="text-warning text-decoration-none small fw-bold">
              Need an account? Enlist here.
            </Link>
            <Link href="/" className="text-decoration-none small">
              &larr; Back
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
}