"use client"; 

import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react"; 
import { useRouter } from "next/navigation"; 
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react"; 

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession(); 
  
  const [formValues, setFormValues] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  // If they are already logged in when they hit the page, kick them to dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    const loadingToast = toast.loading("Verifying credentials...");

    const result = await signIn("credentials", {
      redirect: false, 
      email: formValues.email,
      password: formValues.password,
    });

    if (result?.error) {
      toast.error(result.error, { id: loadingToast });
      setFormValues((prev) => ({
        ...prev,
        password: "" 
      }));
    } else {
      toast.success("Login successful! Welcome back.", { id: loadingToast });
      router.push("/dashboard");
      router.refresh(); 
    }
  };

  if (status === "loading" || status === "authenticated") {
    return <div className="min-vh-100 bg-dark"></div>;
  }

  return (
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center bg-dark text-white" 
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://www.chromethemer.com/download/hd-wallpapers/gundam-3840x2160.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <Toaster position="bottom-right" reverseOrder={false} />

      <div className="card bg-dark border-secondary shadow-lg p-4" style={{ width: '100%', maxWidth: '400px' }}>
        
        <h2 className="text-center mb-4" style={{ fontFamily: '"Press Start 2P", cursive', color: '#ffd700', fontSize: '1.5rem' }}>
          SYSTEM LOGIN
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-light fw-bold">Email: Address <span className="text-danger">*</span></label>
            <input 
              type="email" 
              name="email"
              value={formValues.email}
              onChange={handleChange} 
              placeholder="pilot@efsf.com"
              className="form-control bg-white text-dark border-0" 
              required 
            />
          </div>
          
          <div className="mb-4">
            {/* 🚀 Updated Label Area: Added Forgot Password Link */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label text-light fw-bold mb-0">Password: <span className="text-danger">*</span></label>
              <Link href="/forgot_password" className="text-info text-decoration-none small">
                Forgot Password?
              </Link>
            </div>
            <div className="position-relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                value={formValues.password}
                onChange={handleChange} 
                placeholder="••••••••"
                className="form-control bg-white text-dark border-0" 
                style={{ paddingRight: '2.5rem' }} 
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent"
                style={{ paddingRight: '10px', color: '#ccc', zIndex: 5 }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <div className="d-flex justify-content-center gap-3 px-3 my-4">
            <button 
              type="submit" 
              className="btn btn-lively w-100px fw-bold py-2" 
            >
              Login
            </button>

            <Link href="/" className="btn btn-lively w-auto fw-bold py-2">
             Cancel
            </Link>
          </div>
          
          <div className="text-center mt-2 d-flex flex-column gap-4">
            <Link href="/signup" className="text-warning text-decoration-none small fw-bold">
              Need an account? <span className="text-primary">Sign Up here.</span>
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
}