"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { updateCategory } from "../../action";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Define the shape of the data we are receiving from the Server
type Category = {
  id: number;
  name: string;
  description: string;
};

export default function EditCategoryForm({ category }: { category: Category }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Updating classification...");

    const formData = new FormData(e.currentTarget);
    // 🚀 Pass BOTH the ID and the form data to the action!
    const result = await updateCategory(category.id, formData);

    if (result?.error) {
      toast.error(result.error, { id: loadingToast });
      setLoading(false);
    } else {
      toast.success("Classification updated!", { id: loadingToast });
      router.push("/admin/category"); 
    }
  };

  return (
    <>
      <Toaster position="bottom-right" />
      
      {/* CRM Back Button */}
      <div className="mb-4">
        <Link 
          href="/admin/category" 
          className="crm-back-link btn btn-secondary d-inline-flex align-items-center gap-2"
        >
          <ArrowLeft size={16} />
          <span className="small fw-bold text-uppercase">Back to Category Classifications</span>
        </Link>
      </div>

      {/* Edit Category Form Card */}
      <div className="card crm-card text-white border-secondary shadow-lg">
        <div className="card-header border-bottom border-dark bg-dark py-4 px-4 d-flex align-items-center gap-3">
          <Pencil className="text-info" size={28} />
          <h5 className="mb-0 fw-bold text-info" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1rem' }}>
            EDIT CLASSIFICATION
          </h5>
        </div>
        
        <div className="card-body p-4 p-md-5">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="formbtn btn-secondary text-uppercase mb-2">Category Name</label>
              <input 
                type="text" 
                name="name" 
                defaultValue={category.name} // 🚀 PRE-FILLS THE NAME
                className="form-control bg-dark text-white border-secondary py-2 px-3" 
                style={{ transition: 'border-color 0.2s', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = '#0dcaf0'}
                onBlur={(e) => e.target.style.borderColor = '#6c757d'}
                required 
              />
            </div>
            
            <div className="mb-5">
              <label className="formbtn btn-secondary text-uppercase mb-2">Description</label>
              <textarea 
                name="description" 
                defaultValue={category.description} // 🚀 PRE-FILLS THE DESCRIPTION
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
                {loading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}