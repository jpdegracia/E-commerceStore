"use client";

import Link from "next/link";
import { useState } from "react";
import { generateResetToken } from "./action";
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading("Locating pilot records...");

    const formData = new FormData();
    formData.append("email", email);

    const result = await generateResetToken(formData);

    if (result.error) {
      toast.error(result.error, { id: loadingToast });
    } else {
      toast.success("If the email exists, a reset link has been sent.", { id: loadingToast, duration: 5000 });
      setEmail(""); // Clear the form
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark text-white" 
      style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("https://www.chromethemer.com/download/hd-wallpapers/gundam-3840x2160.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <Toaster position="bottom-right" />
      
      <div className="card bg-dark border-secondary shadow-lg p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-3" style={{ fontFamily: '"Press Start 2P", cursive', color: '#ffd700', fontSize: '1.2rem' }}>
          SYSTEM RECOVERY
        </h2>
        <p className="text-center text-white small mb-4">Enter your registered email address to receive a password reset transmission.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label text-light fw-bold">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              className="form-control bg-white text-dark border-0" 
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-warning w-100 fw-bold py-2 mb-3">
            Send Reset Link
          </button>
          
          <div className="text-center mt-3">
            <Link href="/login" className="btn btn-lively text-decoration-none text-light small opacity-75">
              &larr; Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}