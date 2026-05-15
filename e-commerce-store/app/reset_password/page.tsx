"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { resetPassword } from "./action";
import toast, { Toaster } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

// We separate the form into its own component so we can wrap it in Suspense
// (Next.js requires Suspense when using useSearchParams in a client component)
function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Grabs ?token=1234 from the URL
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // If there is no token in the URL, block the form
  if (!token) {
    return (
      <div className="text-center">
        <h4 className="text-danger mb-3">⚠️ Invalid Transmission</h4>
        <p className="text-light">No reset token found in the URL.</p>
        <Link href="/forgot-password" className="btn btn-outline-warning mt-3">Request New Link</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    const loadingToast = toast.loading("Overwriting security credentials...");

    const formData = new FormData();
    formData.append("token", token);
    formData.append("password", password);

    const result = await resetPassword(formData);

    if (result.error) {
      toast.error(result.error, { id: loadingToast });
    } else {
      toast.success("Password updated successfully!", { id: loadingToast });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label text-light fw-bold">New Password</label>
        <div className="position-relative">
          <input 
            type={showPassword ? "text" : "password"} 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            className="form-control bg-white text-dark border-0" 
            style={{ paddingRight: '2.5rem' }} 
            required 
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent"
            style={{ paddingRight: '10px', color: '#ccc', zIndex: 5 }}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="form-label text-light fw-bold">Confirm New Password</label>
        <input 
          type="password" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)} 
          className="form-control bg-white text-dark border-0" 
          required 
        />
      </div>
      
      <button type="submit" className="btn btn-warning w-100 fw-bold py-2 mb-3">
        Update Credentials
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark text-white" 
      style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("https://www.chromethemer.com/download/hd-wallpapers/gundam-3840x2160.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <Toaster position="bottom-right" />
      
      <div className="card bg-dark border-secondary shadow-lg p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4" style={{ fontFamily: '"Press Start 2P", cursive', color: '#ffd700', fontSize: '1.2rem' }}>
          NEW CREDENTIALS
        </h2>
        
        {/* Next.js requires Client Components reading searchParams to be wrapped in Suspense */}
        <Suspense fallback={<div className="text-center text-light">Loading secure channel...</div>}>
          <ResetPasswordForm />
        </Suspense>

      </div>
    </div>
  );
}