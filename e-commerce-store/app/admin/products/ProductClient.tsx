"use client";

import { useState, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
import { deleteProduct } from "./action";
import { 
  Trash2, Pencil, Search, ChevronLeft, ChevronRight, 
  ArrowUp, ArrowDown, ArrowUpDown 
} from "lucide-react";
import Link from "next/link";

type Product = { 
  id: number; 
  name: string; 
  price: number; 
  stock: number; 
  image: string; 
  categories: { id: number; name: string }[]; 
};

type SortColumn = "name" | "category" | "price" | "stock" | null;
type SortDirection = "asc" | "desc";

export default function ProductClient({ initialProducts }: { initialProducts: Product[] }) {
  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const itemsPerPage = 10;

  // --- FILTERING & SORTING LOGIC ---
  const filteredAndSortedProducts = useMemo(() => {
    // 1. First, Filter the search term
    const lowercasedSearch = searchTerm.toLowerCase();
    let result = initialProducts.filter((product) => {
      return (
        product.name.toLowerCase().includes(lowercasedSearch) ||
        product.categories.name.toLowerCase().includes(lowercasedSearch) ||
        product.price.toString().includes(lowercasedSearch) ||
        product.stock.toString().includes(lowercasedSearch)
      );
    });

    // 2. Then, Sort the filtered results
    if (sortColumn) {
      result.sort((a, b) => {
        let valueA: any = a[sortColumn as keyof Product];
        let valueB: any = b[sortColumn as keyof Product];

        // Handle the nested category string for sorting
        if (sortColumn === "category") {
          valueA = a.categories.name.toLowerCase();
          valueB = b.categories.name.toLowerCase();
        } else if (typeof valueA === "string") {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        }

        if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
        if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [searchTerm, initialProducts, sortColumn, sortDirection]);

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredAndSortedProducts]);

  // --- HANDLERS ---
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to page 1 on new search
  };

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new column and default to ascending
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to scrap this unit?")) return;
    
    const loadingToast = toast.loading("Deleting product...");
    const result = await deleteProduct(id);
    
    if (result.error) toast.error(result.error, { id: loadingToast });
    else toast.success("Unit scrapped.", { id: loadingToast });
  };

  // Helper to render the correct sort icon
  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) return <ArrowUpDown size={14} className="text-white ms-1 opacity-50" />;
    return sortDirection === "asc" ? 
      <ArrowUp size={14} className="text-success ms-1" /> : 
      <ArrowDown size={14} className="text-success ms-1" />;
  };

  return (
    <div className="row g-4">
      <Toaster position="bottom-right" />
      
      <div className="col-12">
        <div className="card crm-card text-white border-secondary shadow h-100">
          
          {/* HEADER WITH SEARCH BAR */}
          <div className="card-header border-bottom border-dark bg-dark py-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <h6 className="mb-0 fw-bold text-success">Active Database</h6>
            
            <div className="position-relative" style={{ maxWidth: '300px', width: '100%' }}>
              <div className="position-absolute top-50 start-0 translate-middle-y ps-3 text-white">
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
              <thead className="text-white small text-uppercase" style={{ userSelect: 'none' }}>
                <tr>
                  <th className="ps-4">Image</th>
                  <th onClick={() => handleSort("name")} style={{ cursor: 'pointer' }} className="hover-text-white transition-all">
                    Name <SortIcon column="name" />
                  </th>
                  <th onClick={() => handleSort("category")} style={{ cursor: 'pointer' }} className="hover-text-white transition-all">
                    Category <SortIcon column="category" />
                  </th>
                  <th onClick={() => handleSort("price")} style={{ cursor: 'pointer' }} className="hover-text-white transition-all">
                    Price <SortIcon column="price" />
                  </th>
                  <th onClick={() => handleSort("stock")} style={{ cursor: 'pointer' }} className="hover-text-white transition-all">
                    Stock <SortIcon column="stock" />
                  </th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5 text-white">
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
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {product.categories.length === 0 ? (
                            <span className="text-muted small">None</span>
                          ) : (
                            product.categories.map(cat => (
                              <span key={cat.id} className="badge bg-dark border border-secondary text-info">
                                {cat.name}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                      <td>{product.price} PHP</td>
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

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="card-footer bg-dark border-top border-secondary py-3 d-flex justify-content-between align-items-center">
              <div className="small text-white ps-2">
                Showing <span className="text-white fw-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-white fw-bold">{Math.min(currentPage * itemsPerPage, filteredAndSortedProducts.length)}</span> of <span className="text-white fw-bold">{filteredAndSortedProducts.length}</span> entries
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