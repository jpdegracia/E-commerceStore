"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { addCategory, deleteCategory } from "./action";
import { Trash2 } from "lucide-react";

type CategoryWithCount = {
  id: number;
  name: string;
  description: string;
  _count: {
    products: number;
  };
};

export default function CategoryClient({ initialCategories }: { initialCategories: CategoryWithCount[] }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Registering classification...");

    const formData = new FormData(e.currentTarget);
    const result = await addCategory(formData);

    if (result.error) {
      toast.error(result.error, { id: loadingToast });
    } else {
      toast.success("Category registered successfully!", { id: loadingToast });
      (e.target as HTMLFormElement).reset(); 
    }
    setLoading(false);
  };

  const handleDelete = async (id: number, productCount: number) => {
    if (productCount > 0) {
      toast.error(`Cannot delete! Reassign all ${productCount} units first.`);
      return;
    }

    if (!confirm("Are you sure you want to delete this category?")) return;
    
    const loadingToast = toast.loading("Deleting classification...");
    const result = await deleteCategory(id);
    
    if (result.error) {
      toast.error(result.error, { id: loadingToast });
    } else {
      toast.success("Category deleted.", { id: loadingToast });
    }
  };

  return (
    <div className="row g-4">
      <Toaster position="bottom-right" />
      
      
      {/* ADD CATEGORY FORM */}
      <div className="col-lg-4">
        <div className="card bg-secondary text-white border-secondary shadow">
          <div className="card-header border-bottom border-dark bg-dark">
            <h5 className="mb-0 fw-bold">New Classification</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Category Name</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="e.g., Perfect Grade"
                  className="form-control bg-dark text-white border-0" 
                  required 
                />
              </div>
              
              <div className="mb-4">
                <label className="form-label small fw-bold">Description</label>
                <textarea 
                  name="description" 
                  placeholder="Details about this classification..."
                  className="form-control bg-dark text-white border-0" 
                  rows={4} 
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-info w-100 fw-bold text-dark" disabled={loading}>
                {loading ? "Processing..." : "Add Category"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* CATEGORY LIST TABLE */}
      <div className="col-lg-8">
        <div className="card bg-secondary text-white border-secondary shadow h-100">
          <div className="card-header border-bottom border-dark bg-dark">
            <h5 className="mb-0 fw-bold">Database Classifications</h5>
          </div>
          <div className="card-body p-0" style={{ overflowX: 'auto' }}>
            <table className="table table-dark table-hover mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Assigned Units</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {initialCategories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4">No classifications found.</td>
                  </tr>
                ) : (
                  initialCategories.map((cat) => (
                    <tr key={cat.id} className="align-middle">
                      <td className="fw-bold text-info">{cat.name}</td>
                      <td className="small">{cat.description}</td>
                      <td>
                        <span className={`badge ${cat._count.products > 0 ? 'bg-primary' : 'bg-secondary text-dark'}`}>
                          {cat._count.products} Units
                        </span>
                      </td>
                      <td className="text-end">
                        <button 
                          onClick={() => handleDelete(cat.id, cat._count.products)} 
                          className="btn btn-sm btn-outline-danger" 
                          title="Delete"
                          disabled={cat._count.products > 0} // Visually disable if it has products
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
    </div>
  );
}