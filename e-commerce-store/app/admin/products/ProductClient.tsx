"use client";

import { useState, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
import { deleteProduct } from "./action";
import { Trash2, Pencil, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

type Product = { 
  id: number; 
  name: string; 
  price: number; 
  stock: number; 
  image: string; 
  category: { id: number; name: string }; 
};

export default function ProductClient({ initialProducts }: { initialProducts: Product[] }) {
  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- FILTERING LOGIC ---
  // useMemo ensures we only recalculate this when searchTerm or initialProducts change
  const filteredProducts = useMemo(() => {
    const lowercasedSearch = searchTerm.toLowerCase();
    return initialProducts.filter((product) => {
      return (
        product.name.toLowerCase().includes(lowercasedSearch) ||
        product.category.name.toLowerCase().includes(lowercasedSearch) ||
        product.price.toString().includes(lowercasedSearch) ||
        product.stock.toString().includes(lowercasedSearch)
      );
    });
  }, [searchTerm, initialProducts]);

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredProducts]);

  // Handle Search Input Change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // 🚀 Reset to page 1 whenever they type a new search!
  };

  // --- ACTION LOGIC ---
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to scrap this unit?")) return;
    
    const loadingToast = toast.loading("Deleting product...");
    const result = await deleteProduct(id);
    
    if (result.error) toast.error(result.error, { id: loadingToast });
    else toast.success("Unit scrapped.", { id: loadingToast });
  };

  return (
    <div className="row g-4">
      <Toaster position="bottom-right" />
      
      <div className="col-12">
        <div className="card crm-card text-white border-secondary shadow h-100">
          
          {/* 🚀 HEADER WITH SEARCH BAR */}
          <div className="card-header border-bottom border-dark bg-dark py-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <h6 className="mb-0 fw-bold text-success">Active Database</h6>
            
            <div className="position-relative" style={{ maxWidth: '300px', width: '100%' }}>
              <div className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Search by name, class, price..."
                value={searchTerm}
                onChange={handleSearch}
                className="form-control bg-secondary text-white border-secondary ps-5"
                style={{ fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div className="card-body p-0" style={{ overflowX: 'auto' }}>
            <table className="table table-dark table-hover mb-0">
              <thead className="text-muted small text-uppercase">
                <tr>
                  <th className="ps-4">Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5 text-muted">
                      {searchTerm ? "No units match your search parameters." : "Hangar is empty."}
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((product) => (
                    <tr key={product.id} className="align-middle">
                      <td className="ps-4 py-3">
                        <img src={product.image} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                      </td>
                      <td className="fw-bold text-success">{product.name}</td>
                      <td><span className="badge bg-dark border border-secondary text-info">{product.category.name}</span></td>
                      <td>{product.price} CR</td>
                      <td>
                        <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <div className="d-flex justify-content-end gap-2">
                          <Link href={`/admin/products/${product.id}/edit_product`} className="btn btn-sm btn-outline-info">
                            <Pencil size={16} />
                          </Link>
                          <button onClick={() => handleDelete(product.id)} className="btn btn-sm btn-outline-danger">
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

          {/* 🚀 PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="card-footer bg-dark border-top border-secondary py-3 d-flex justify-content-between align-items-center">
              <div className="small text-muted ps-2">
                Showing <span className="text-white fw-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-white fw-bold">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> of <span className="text-white fw-bold">{filteredProducts.length}</span> entries
              </div>
              
              <div className="btn-group pe-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                <div className="btn btn-sm btn-secondary disabled text-white fw-bold px-3">
                  {currentPage} / {totalPages}
                </div>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}