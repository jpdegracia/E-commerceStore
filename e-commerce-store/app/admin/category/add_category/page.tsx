"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { addCategory } from "../action";
import { ArrowLeft, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddCategoryPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Registering classification...");

    const formData = new FormData(e.currentTarget);
    const result = await addCategory(formData);

    if (result?.error) {
      toast.error(result.error, { id: loadingToast });
      setLoading(false);
    } else {
      toast.success("Category registered successfully!", { id: loadingToast });
      // 🚀 Redirect them smoothly back to the data table!
      router.push("/admin/category"); 
    }
  };

  return (
    <div className="min-vh-100 bg-dark text-white pt-5 mt-4 pb-5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="container" style={{ maxWidth: '600px' }}> {/* Kept narrow for form readability */}
        <Toaster position="bottom-right" />
        
        {/* CRM Back Button */}
        <div className="mb-4">
          <Link 
            href="/admin/category" 
            className="crm-back-link text-decoration-none text-white d-inline-flex align-items-center gap-2"
          >
            <ArrowLeft size={16} />
            <span className="small fw-bold text-uppercase">Back to Classifications</span>
          </Link>
        </div>

        {/* Add Category Form Card */}
        <div className="card crm-card text-white border-secondary shadow-lg">
          <div className="card-header border-bottom border-dark bg-dark py-4 px-4 d-flex align-items-center gap-3">
            <PlusCircle className="text-info" size={28} />
            <h5 className="mb-0 fw-bold text-info" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1rem' }}>
              NEW CLASSIFICATION
            </h5>
          </div>
          
          <div className="card-body p-4 p-md-5">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label small fw-bold text-white text-uppercase mb-2">Category Name</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="e.g., Perfect Grade (PG)"
                  className="form-control bg-dark text-white border-secondary py-2 px-3" 
                  style={{ transition: 'border-color 0.2s', outline: 'none' }}
                  onFocus={(e) => e.target.style.borderColor = '#0dcaf0'}
                  onBlur={(e) => e.target.style.borderColor = '#6c757d'}
                  required 
                />
              </div>
              
              <div className="mb-5">
                <label className="form-label small fw-bold text-white text-uppercase mb-2">Description</label>
                <textarea 
                  name="description" 
                  placeholder="Details about this classification..."
                  className="form-control bg-dark text-white border-secondary py-2 px-3" 
                  rows={5} 
                  style={{ transition: 'border-color 0.2s', outline: 'none' }}
                  onFocus={(e) => e.target.style.borderColor = '#0dcaf0'}
                  onBlur={(e) => e.target.style.borderColor = '#6c757d'}
                  required
                ></textarea>
              </div>

              <div className="d-flex gap-3">
                <Link href="/admin/category" className="btn btn-outline-secondary fw-bold py-2 w-50">
                  Cancel
                </Link>
                <button type="submit" className="btn btn-info fw-bold text-dark w-50 py-2 d-flex justify-content-center align-items-center gap-2" disabled={loading}>
                  {loading ? "Processing..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}