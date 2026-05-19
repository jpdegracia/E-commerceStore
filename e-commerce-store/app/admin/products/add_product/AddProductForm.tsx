"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { addProduct } from "../action";
import { ArrowLeft, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddProductForm({ categories }: { categories: { id: number; name: string }[] }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Adding to hangar...");
    
    const result = await addProduct(new FormData(e.currentTarget));

    if (result?.error) {
      toast.error(result.error, { id: loadingToast });
      setLoading(false);
    } else {
      toast.success("Unit added successfully!", { id: loadingToast });
      router.push("/admin/products"); 
    }
  };

  return (
    <>
      <Toaster position="bottom-right" />
      <div className="mb-4">
          <Link href="/admin/products" className="crm-back-link text-white btn btn-secondary d-inline-flex align-items-center gap-2">
            <ArrowLeft size={16} />
            <span className="small fw-bold text-uppercase">Back to Product Inventory</span>
          </Link>
        </div>

      <div className="card crm-card text-white border-secondary shadow-lg">
        <div className="card-header border-bottom border-dark bg-dark py-4 px-4 d-flex align-items-center gap-3">
          <PlusCircle className="text-success" size={28} />
          <h5 className="mb-0 fw-bold text-success" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1rem' }}>REGISTER NEW UNIT</h5>
        </div>
        
        <div className="card-body p-4 p-md-5">
          {categories.length === 0 && (
            <div className="alert alert-danger mb-4">⚠️ Create a Category first before adding a product!</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <label className="form-label small fw-bold text-white text-uppercase">Unit Name</label>
                <input type="text" name="name" className="form-control bg-dark text-white border-secondary" required />
              </div>
             <div className="col-md-6">
                <label className="form-label small fw-bold text-white text-uppercase mb-2">Classifications</label>
                
                {/* 🚀 THE FIX: Fixed height container with vertical scrolling */}
                <div 
                  className="bg-dark border border-secondary rounded p-2 crm-custom-scrollbar" 
                  style={{ maxHeight: '120px', overflowY: 'auto' }}
                >
                  <div className="d-flex flex-column gap-1">
                    {categories.map((cat) => {
                      return (
                        <div key={cat.id} className="form-check m-0 px-3 py-1 rounded category-list-item d-flex align-items-center">
                          <input 
                            className="form-check-input border-secondary shadow-none m-0" 
                            type="checkbox" 
                            name="categoryIds" 
                            value={cat.id} 
                            id={`cat-${cat.id}`} 
                            style={{ cursor: 'pointer' }}
                          />
                          {/* w-100 makes the whole row clickable! */}
                          <label className="form-check-label small text-white ms-2 w-100 user-select-none" htmlFor={`cat-${cat.id}`} style={{ cursor: 'pointer' }}>
                            {cat.name}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <label className="form-label small fw-bold text-white text-uppercase">Price</label>
                <input type="number" name="price" className="form-control bg-dark text-white border-secondary" required />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold text-white text-uppercase">Stock</label>
                <input type="number" name="stock" defaultValue="1" className="form-control bg-dark text-white border-secondary" required />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold text-white text-uppercase">Image URL</label>
              <input type="url" name="image" placeholder="https://..." className="form-control bg-dark text-white border-secondary" required />
            </div>

            <div className="mb-5">
              <label className="form-label small fw-bold text-white text-uppercase">Description</label>
              <textarea name="description" className="form-control bg-dark text-white border-secondary" rows={4} required></textarea>
            </div>

            <div className="d-flex gap-3 justify-content-end">
              <Link href="/admin/products" className="btn btn-outline-secondary fw-bold py-2 px-4">Cancel</Link>
              <button type="submit" className="btn btn-success fw-bold text-dark py-2 px-4" disabled={loading || categories.length === 0}>
                {loading ? "Processing..." : "Register Unit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}