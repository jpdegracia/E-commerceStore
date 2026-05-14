import Link from "next/link";
import { registerCustomer } from "./action";

export default function SignUpPage() {
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
          JOIN HAVEN
        </h2>
        
        <form action={registerCustomer}>
          <div className="mb-3">
            <label className="form-label text-light fw-bold">Full Name</label>
            <input 
              type="text" 
              name="name" 
              placeholder="Amuro Ray"
              className="form-control bg-secondary text-white border-0" 
              required 
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light fw-bold">Username</label>
            <input 
              type="text" 
              name="username" 
              placeholder="AgentX44"
              className="form-control bg-secondary text-white border-0" 
              required 
            />
          </div>
          
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
            className="btn w-100 fw-bold py-2" 
            style={{ background: '#1974D2', color: 'white', borderRadius: '50px' }}
          >
            Create Account
          </button>
          
          <div className="text-center mt-4">
            <Link href="/" className=" text-decoration-none small hover-white">
             Cancel and go back
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
}