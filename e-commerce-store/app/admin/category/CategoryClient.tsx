"use client";

import toast, { Toaster } from "react-hot-toast";
import { deleteCategory } from "./action";
import { Trash2, Pencil } from "lucide-react";
import Link from "next/link";

type CategoryWithCount = {
  id: number;
  name: string;
  description: string;
  _count: {
    products: number;
  };
};

export default function CategoryClient({ initialCategories }: { initialCategories: CategoryWithCount[] }) {
  
  const handleDelete = async (id: number, productCount: number) => {
    if (productCount > 0) {
      toast.error(`Cannot delete! Reassign or delete all ${productCount} units first.`);
      return;
    }

    if (!confirm("Are you sure you want to delete this classification?")) return;
    
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
      
      {/* 🚀 CATEGORY LIST TABLE NOW TAKES FULL WIDTH (col-12) */}
      <div className="col-12">
        <div className="card crm-card text-white border-secondary shadow h-100">
          <div className="card-header border-bottom border-dark bg-dark py-3">
            <h6 className="mb-0 fw-bold text-info">Database Classifications</h6>
          </div>
          <div className="card-body p-0" style={{ overflowX: 'auto' }}>
            <table className="table table-dark table-hover mb-0">
              <thead className="text-white small text-uppercase">
                <tr>
                  <th className="ps-4">Name</th>
                  <th>Description</th>
                  <th>Assigned Units</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {initialCategories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-5 text-white">No classifications found in the database.</td>
                  </tr>
                ) : (
                  initialCategories.map((cat) => (
                    <tr key={cat.id} className="align-middle">
                      <td className="ps-4 py-3 fw-bold text-info">{cat.name}</td>
                      <td className="text-white small">{cat.description}</td>
                      <td>
                        <span className={`badge ${cat._count.products > 0 ? 'bg-primary' : 'bg-dark border border-secondary text-white'}`}>
                          {cat._count.products} Units
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <div className="d-flex justify-content-end gap-2">
                          
                          {/* 🚀 NEW EDIT BUTTON */}
                          <Link 
                            href={`/admin/category/${cat.id}/edit_category`} 
                            className="btn btn-sm btn-outline-info" 
                            title="Edit Category"
                          >
                            <Pencil size={16} />
                          </Link>

                          {/* DELETE BUTTON */}
                          <button 
                            onClick={() => handleDelete(cat.id, cat._count.products)} 
                            className="btn btn-sm btn-outline-danger" 
                            title={cat._count.products > 0 ? "Cannot delete while units are assigned" : "Delete"}
                            disabled={cat._count.products > 0} 
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>
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