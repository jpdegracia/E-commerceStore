"use client"; 

import Link from "next/link";
import { useState } from "react";
import { registerCustomer } from "./action";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
  // 🚀 Track all form inputs in state
  const [formValues, setFormValues] = useState({
    name: "",
    username: "",
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  // Handle typing in the inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value
    });
  };

  const handleClientAction = async (formData: FormData) => {
    const loadingToast = toast.loading("Initializing pilot profile...");

    const result = await registerCustomer(formData);

    if (result?.error) {
      toast.error(result.error, { id: loadingToast });
      
      // 🚀 If a specific field caused the error, clear ONLY that field
      if (result.field && result.field !== "all") {
        setFormValues((prev) => ({
          ...prev,
          [result.field]: "" // Reset just the bad input
        }));
      }
    } else {
      toast.success("Profile created! Welcome to Haven.", { id: loadingToast });
    }
  };

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
          JOIN HAVEN
        </h2>
        
        <form action={handleClientAction}>
          <div className="mb-3">
            <label className="form-label text-light fw-bold">Full Name <span className="text-danger">*</span></label>
            <input 
              type="text" 
              name="name" 
              value={formValues.name}
              onChange={handleChange}
              placeholder="Amuro Ray"
              className="form-control bg-white text-dark border-0" 
              required 
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light fw-bold">Username <span className="text-danger">*</span></label>
            <input 
              type="text" 
              name="username" 
              value={formValues.username}
              onChange={handleChange}
              placeholder="AgentX44"
              className="form-control bg-white text-dark border-0" 
              required 
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label text-light fw-bold">Email Address <span className="text-danger">*</span></label>
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
            <label className="form-label text-light fw-bold">Password <span className="text-danger">*</span></label>
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
                {/* 🚀 Replaced SVGs with Lucide React Components */}
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <div className="d-flex justify-content-end gap-3 px-3 mt-5">
            <button 
              type="submit" 
              className="btn btn-lively w-auto fw-bold py-2" 
            >
              Create Account
            </button>

            <Link href="/" className="btn btn-lively w-auto fw-bold py-2">
             Cancel
            </Link>
          </div>

        </form>

      </div>
    </div>
  );
}