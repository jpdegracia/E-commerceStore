import { prisma } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, CreditCard } from "lucide-react";
import QuantityControl from "./QuantityControl";

export default async function CartPage() {
  // 1. Authenticate the user session
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  // 2. Fetch the user's cart and include full product profiles
  const cart = await prisma.cart.findUnique({
    where: { userId: parseInt(session.user.id) },
    include: {
      items: {
        include: {
          product: true, // Pulls name, price, stock, and image!
        },
        orderBy: { id: "asc" },
      },
    },
  });

  // Calculate global invoice values
  const totalItems = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const subtotal = cart?.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) || 0;

  return (
    <div className="min-vh-100 bg-dark text-white pt-5 mt-4 pb-5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="container">
        
        {/* Back navigation */}
        <div className="mb-4">
          <Link href="/dashboard" className="text-decoration-none text-muted d-inline-flex align-items-center gap-2 hover-text-warning transition-all">
            <ArrowLeft size={16} />
            <span className="small fw-bold text-uppercase">Return to Main Hangar</span>
          </Link>
        </div>

        <h2 className="mb-4 text-info" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1.2rem' }}>
          SECURED MANIFEST
        </h2>

        <div className="row g-4">
          {/* LEFT SIDE: Items List */}
          <div className="col-lg-8">
            {!cart || cart.items.length === 0 ? (
              <div className="p-5 border border-secondary border-dashed rounded-4 text-center bg-secondary bg-opacity-25">
                <ShoppingBag className="text-muted mb-3" size={48} />
                <h4 className="text-white mb-2">No Units Staged</h4>
                <p className="text-muted mb-4">Your manifest is currently empty. Request immediate hardware allocations from the dashboard.</p>
                <Link href="/dashboard" className="btn btn-outline-info fw-bold btn-sm">Browse Catalog</Link>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {cart.items.map((item) => (
                  <div key={item.id} className="card bg-secondary border-secondary shadow-sm rounded-4 overflow-hidden">
                    <div className="card-body bg-dark p-3">
                      
                      {/* 🚀 FIXED: Perfectly balanced 12-column grid */}
                      <div className="row g-3 align-items-center">
                        
                        {/* Product Image */}
                        <div className="col-3 col-sm-2">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="img-fluid rounded-3 border border-secondary" 
                            style={{ height: '80px', width: '100%', objectFit: 'cover' }} 
                          />
                        </div>

                        {/* Title & Static Details */}
                        <div className="col-9 col-sm-6">
                          <h6 className="text-white fw-bold mb-1 text-truncate" title={item.product.name}>
                            {item.product.name}
                          </h6>
                          <small className="text-white d-block">
                            <span className="text-warning">{item.product.price.toLocaleString()}</span> PHP per unit
                          </small>
                        </div>

                        {/* Stacked Price and Controls on the right */}
                        <div className="col-12 col-sm-4 d-flex flex-column align-items-end justify-content-center gap-2 mt-3 mt-sm-0 pt-3 pt-sm-0 border-secondary border-opacity-25 border-sm-0">

                          {/* Total Line Price */}
                          <div className="fw-bold text-warning fs-5 lh-1">
                            {(item.product.price * item.quantity).toLocaleString()} PHP
                          </div>
                          
                          {/* Quantity Control Panel (Now contains the "QTY" text inside it) */}
                          <QuantityControl itemId={item.id} quantity={item.quantity} />
                          
                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDE: Summary Invoice Box */}
          <div className="col-lg-4">
            <div className="card bg-white border-secondary shadow-lg rounded-4 p-4 sticky-top" style={{ top: '100px', zIndex: 10 }}>
              <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom border-dark text-uppercase small tracking-wider">Telemetries</h5>
              
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted small">Total Allocated Units</span>
                <span className="fw-bold text-dark small">{totalItems}</span>
              </div>
              <div className="d-flex justify-content-between mb-4">
                <span className="text-muted small">Logistics & Freight</span>
                <span className="text-success small fw-bold">FREE</span>
              </div>

              <div className="p-3 bg-dark rounded-3 border border-dark mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="small fw-bold text-muted text-uppercase">Total Ledger</span>
                  <span className="fs-4 fw-bold text-warning">{subtotal.toLocaleString()} PHP</span>
                </div>
              </div>

              <button 
                disabled={totalItems === 0}
                className="btn btn-info text-dark w-100 fw-bold py-3 rounded-3 d-flex align-items-center justify-content-center gap-2 shadow-lg hover-scale transition-all"
              >
                <CreditCard size={18} />
                Authorize Deployment
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}