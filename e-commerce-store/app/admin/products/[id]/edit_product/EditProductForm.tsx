"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { updateProduct } from "../../action";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EditProductForm({ product, categories }: { product: any, categories: any[] }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Updating unit...");
    
    const result = await updateProduct(product.id, new FormData(e.currentTarget));

    if (result?.error) {
      toast.error(result.error, { id: loadingToast });
      setLoading(false);
    } else {
      toast.success("Unit updated successfully!", { id: loadingToast });
      router.push("/admin/products"); 
    }
  };

  return (
    <>
      <Toaster position="bottom-right" />
      <div className="mb-4">
        <Link href="/admin/products" className="crm-back-link text-white  d-inline-flex align-items-center gap-2">
          <ArrowLeft size={16} />
          <span className="small fw-bold text-uppercase">Back to Inventory</span>
        </Link>
      </div>

      <div className="card crm-card text-white border-secondary shadow-lg">
        <div className="card-header border-bottom border-dark bg-dark py-4 px-4 d-flex align-items-center gap-3">
          <Pencil className="text-info" size={28} />
          <h5 className="mb-0 fw-bold text-info" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1rem' }}>EDIT UNIT</h5>
        </div>
        
        <div className="card-body p-4 p-md-5">
          <form onSubmit={handleSubmit}>
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <label className="form-label small fw-bold  text-uppercase">Unit Name</label>
                <input type="text" name="name" defaultValue={product.name} className="form-control bg-dark text-white border-secondary" required />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold  text-uppercase">Classification</label>
                <select name="categoryId" defaultValue={product.categoryId} className="form-select bg-dark text-white border-secondary" required>
                  {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
            </div>

            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <label className="form-label small fw-bold  text-uppercase">Price (CR)</label>
                <input type="number" name="price" defaultValue={product.price} className="form-control bg-dark text-white border-secondary" required />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold  text-uppercase">Stock</label>
                <input type="number" name="stock" defaultValue={product.stock} className="form-control bg-dark text-white border-secondary" required />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold  text-uppercase">Image URL</label>
              <input type="url" name="image" defaultValue={product.image} className="form-control bg-dark text-white border-secondary" required />
            </div>

            <div className="mb-5">
              <label className="form-label small fw-bold  text-uppercase">Description</label>
              <textarea name="description" defaultValue={product.description} className="form-control bg-dark text-white border-secondary" rows={4} required></textarea>
            </div>

            <div className="d-flex gap-3 justify-content-end">
              <Link href="/admin/products" className="btn btn-outline-secondary fw-bold py-2 px-4">Cancel</Link>
              <button type="submit" className="btn btn-info fw-bold text-dark py-2 px-4" disabled={loading}>
                {loading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}