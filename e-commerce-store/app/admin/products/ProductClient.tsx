// app/admin/products/ProductClient.tsx
"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { addProduct, deleteProduct } from "./action";
import { Trash2 } from "lucide-react";

// Define our types based on Prisma
type Category = { id: number; name: string };
type Product = { 
  id: number; 
  name: string; 
  price: number; 
  stock: number; 
  image: string; 
  category: Category 
};

export default function ProductClient({ initialProducts, categories }: { initialProducts: Product[], categories: Category[] }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Adding to hangar...");

    const formData = new FormData(e.currentTarget);
    const result = await addProduct(formData);

    if (result.error) {
      toast.error(result.error, { id: loadingToast });
    } else {
      toast.success("Product registered successfully!", { id: loadingToast });
      (e.target as HTMLFormElement).reset(); // Clear the form
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to scrap this unit?")) return;
    
    const loadingToast = toast.loading("Deleting product...");
    const result = await deleteProduct(id);
    
    if (result.error) {
      toast.error(result.error, { id: loadingToast });
    } else {
      toast.success("Unit scrapped.", { id: loadingToast });
    }
  };

  return (
    <div className="row g-4">
      <Toaster position="bottom-right" />
      
      {/* ADD PRODUCT FORM */}
      <div className="col-lg-4">
        <div className="card bg-secondary text-white border-secondary shadow">
          <div className="card-header border-bottom border-dark bg-dark">
            <h5 className="mb-0 fw-bold">Register New Unit</h5>
          </div>
          <div className="card-body">
            
            {/* Warning if no categories exist */}
            {categories.length === 0 && (
              <div className="alert alert-danger p-2 small">
                ⚠️ You must create a Category in the database before adding products!
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Unit Name</label>
                <input type="text" name="name" className="form-control bg-dark text-white border-0" required />
              </div>
              
              <div className="mb-3">
                <label className="form-label small fw-bold">Description</label>
                <textarea name="description" className="form-control bg-dark text-white border-0" rows={3} required></textarea>
              </div>

              <div className="row mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold">Price (Credits)</label>
                  <input type="number" name="price" className="form-control bg-dark text-white border-0" required />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold">Stock</label>
                  <input type="number" name="stock" defaultValue="1" className="form-control bg-dark text-white border-0" required />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Category</label>
                <select name="categoryId" className="form-select bg-dark text-white border-0" required disabled={categories.length === 0}>
                  <option value="">Select Class...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold">Image URL</label>
                <input type="url" name="image" placeholder="https://..." className="form-control bg-dark text-white border-0" required />
              </div>

              <button type="submit" className="btn btn-warning w-100 fw-bold" disabled={loading || categories.length === 0}>
                {loading ? "Registering..." : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* PRODUCT LIST TABLE */}
      <div className="col-lg-8">
        <div className="card bg-secondary text-white border-secondary shadow h-100">
          <div className="card-header border-bottom border-dark bg-dark">
            <h5 className="mb-0 fw-bold">Active Inventory</h5>
          </div>
          <div className="card-body p-0" style={{ overflowX: 'auto' }}>
            <table className="table table-dark table-hover mb-0">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {initialProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-muted">Hangar is empty.</td>
                  </tr>
                ) : (
                  initialProducts.map((product) => (
                    <tr key={product.id} className="align-middle">
                      <td>
                        <img src={product.image} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                      </td>
                      <td className="fw-bold">{product.name}</td>
                      <td><span className="badge bg-info text-dark">{product.category.name}</span></td>
                      <td>{product.price} CR</td>
                      <td>
                        <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="text-end">
                        <button onClick={() => handleDelete(product.id)} className="btn btn-sm btn-outline-danger" title="Delete">
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