import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/db";
import Link from "next/link";
import { 
  Users, Package, Tags, ShoppingCart, 
  Activity, ArrowRight, Clock, PlusCircle, ShieldAlert, ChevronDown
} from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(session.user.id) },
  });

  if (user?.roles !== "ADMIN") {
    redirect("/dashboard");
  }

  // --- CRM DATA FETCHING ---
  const totalUsers = await prisma.user.count();
  const totalProducts = await prisma.product.count();
  const totalCategories = await prisma.category.count();
  const totalOrders = 0; // Placeholder until Orders model is active

  // 🚀 Fetch Latest 10 Pilot Signups
  const recentUsers = await prisma.user.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    select: { id: true, username: true, email: true, createdAt: true, roles: true }
  });

  // 🚀 Fetch Latest 10 Hangar Additions
  const recentProducts = await prisma.product.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: { category: true }
  });

  return (
    <div className="min-vh-100 bg-dark text-white pt-5 mt-4 pb-5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      {/* 🚀 Reverted to "container" so it perfectly aligns with the Navbar */}
      <div className="container">
        
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1 text-warning" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1.2rem' }}>
              SYSTEM OVERVIEW
            </h2>
            <p className=" small mb-0">Welcome back, Commander {user.username}. Here is your daily telemetry.</p>
          </div>
          <div className="d-flex gap-2">
            <Link href="/admin/products" className="btn btn-sm btn-outline-warning d-flex align-items-center gap-2">
              <PlusCircle size={16} /> New Unit
            </Link>
          </div>
        </div>

        {/* TOP ROW: KPI Metrics */}
        <div className="row g-3 mb-4">

          <div className="col-xl-3 col-md-6">
            <Link href="/admin/users" className="text-decoration-none">
              <div className="card crm-card bg-secondary text-white border-0 shadow-sm rounded-3 h-100">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className=" text-uppercase fw-bold mb-2" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Total Users</h6>
                      <h2 className="mb-0 fw-bold">{totalUsers}</h2>
                    </div>
                    <div className="bg-primary p-2 rounded text-white shadow-sm">
                      <Users size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-xl-3 col-md-6">
            <Link href="/admin/products" className="text-decoration-none">
              <div className="card crm-card bg-secondary text-white border-0 shadow-sm rounded-3 h-100">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className=" text-uppercase fw-bold mb-2" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Products</h6>
                      <h2 className="mb-0 fw-bold">{totalProducts}</h2>
                    </div>
                    <div className="bg-success p-2 rounded text-white shadow-sm">
                      <Package size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-xl-3 col-md-6">
            <Link href="/admin/category" className="text-decoration-none">
              <div className="card crm-card bg-secondary text-white border-0 shadow-sm rounded-3 h-100">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className=" text-uppercase fw-bold mb-2" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Categories</h6>
                      <h2 className="mb-0 fw-bold">{totalCategories}</h2>
                    </div>
                    <div className="bg-info p-2 rounded text-dark shadow-sm">
                      <Tags size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-xl-3 col-md-6">
            <Link href="/admin/orders" className="text-decoration-none">
              <div className="card crm-card bg-secondary text-white border-0 shadow-sm rounded-3 h-100">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className=" text-uppercase fw-bold mb-2" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Pending Orders</h6>
                      <h2 className="mb-0 fw-bold text-warning">{totalOrders}</h2>
                    </div>
                    <div className="bg-warning p-2 rounded text-dark shadow-sm">
                      <ShoppingCart size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* MAIN CRM LAYOUT */}
        <div className="row g-4">
          
          {/* Left Column: Activity & Data */}
          <div className="col-lg-8">
            
            {/* 🚀 NATIVE HTML ACCORDION FOR PRODUCTS */}
            <details className="card crm-card border-0 shadow-sm mb-4 rounded-3" open>
              {/* The summary acts as the clickable header */}
              <summary className="card-header bg-secondary border-bottom border-secondary py-3 d-flex justify-content-between align-items-center" style={{ cursor: 'pointer', listStyle: 'none' }}>
                <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                  <Activity size={18} className="text-dark" /> Recent Product Additions
                </h6>
                <div className=" small d-flex align-items-center gap-1 hover-text-warning">
                  Toggle View <ChevronDown size={14} />
                </div>
              </summary>
              
              {/* This body collapses and expands natively! */}
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-dark table-hover mb-0 text-white">
                    <thead className=" small text-uppercase">
                      <tr>
                        <th className="ps-4">Unit</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentProducts.length === 0 ? (
                        <tr><td colSpan={4} className="text-center py-4 ">No units registered yet.</td></tr>
                      ) : (
                        recentProducts.map(product => (
                          <tr key={product.id} className="align-middle">
                            <td className="ps-4 py-3 fw-bold">{product.name}</td>
                            <td><span className="badge bg-dark border border-secondary text-info">{product.category.name}</span></td>
                            <td>{product.price} CR</td>
                            <td>
                              <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                                {product.stock > 0 ? `${product.stock} Units` : 'Out of Stock'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  <div className="p-2 text-center border-top border-secondary bg-dark">
                    <Link href="/admin/products" className="btn btn-lively small hover-text-warning">
                      View Full Inventory Database <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </details>

            {/* 🚀 NATIVE HTML ACCORDION FOR PILOTS */}
            <details className="card crm-card border-0 shadow-sm rounded-3">
              <summary className="card-header bg-secondary border-bottom border-secondary py-3 d-flex justify-content-between align-items-center" style={{ cursor: 'pointer', listStyle: 'none' }}>
                <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                  <Users size={18} className="text-dark" /> New Pilot Registrations
                </h6>
                <div className=" small d-flex align-items-center gap-1 hover-text-warning">
                  Toggle View <ChevronDown size={14} />
                </div>
              </summary>
              
              <div className="card-body p-0">
                <div className="list-group list-group-flush border-0">
                  {recentUsers.length === 0 ? (
                    <div className="p-4 text-center ">No pilots found.</div>
                  ) : (
                    recentUsers.map(u => (
                      <div key={u.id} className="list-group-item crm-list-item bg-transparent text-white border-bottom border-dark py-3 px-4 d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-bold mb-1 d-flex align-items-center gap-2">
                            {u.username}
                            {u.roles === "ADMIN" && <span className="badge bg-danger" style={{fontSize: '0.6rem'}}>ADMIN</span>}
                          </div>
                          <div className=" small">{u.email}</div>
                        </div>
                        <div className=" small d-flex align-items-center gap-1">
                          <Clock size={12} /> {new Date(u.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  )}
                  <div className="p-3 text-center bg-dark rounded-bottom">
                    <Link href="/admin/users" className="btn btn-lively small hover-text-warning">
                      Manage Complete Pilot Directory <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </details>

          </div>

          {/* Right Column: CRM System Actions */}
          <div className="col-lg-4">
            <div className="card crm-card border-0 shadow-sm rounded-3 h-100">
              <div className="card-header bg-dark border-bottom border-secondary py-3">
                <h6 className="mb-0 fw-bold d-flex align-items-center gap-2 text-warning">
                  <ShieldAlert size={18} /> System Controls
                </h6>
              </div>
              <div className="card-body d-flex flex-column gap-3 p-4">
                
                <Link href="/admin/products" className="text-decoration-none">
                  <div className="bg-secondary p-3 rounded d-flex align-items-center crm-action-btn border border-secondary">
                    <div className="bg-dark p-3 rounded me-3 text-success"><Package size={20} /></div>
                    <div>
                      <h6 className="mb-0 fw-bold text-white">Manage Inventory</h6>
                      <small className="text-white">Update stock & pricing</small>
                    </div>
                  </div>
                </Link>

                <Link href="/admin/category" className="text-decoration-none">
                  <div className="bg-secondary p-3 rounded d-flex align-items-center crm-action-btn border border-secondary">
                    <div className="bg-dark p-3 rounded me-3 text-info"><Tags size={20} /></div>
                    <div>
                      <h6 className="mb-0 fw-bold text-white">Classifications</h6>
                      <small className="text-white">Organize your catalog</small>
                    </div>
                  </div>
                </Link>

                <Link href="/admin/users" className="text-decoration-none">
                  <div className="bg-secondary p-3 rounded d-flex align-items-center crm-action-btn border border-secondary">
                    <div className="bg-dark p-3 rounded me-3 text-primary"><Users size={20} /></div>
                    <div>
                      <h6 className="mb-0 fw-bold text-white">Pilot Directory</h6>
                      <small className="text-white">Manage system access</small>
                    </div>
                  </div>
                </Link>

                <div className="mt-auto pt-3 border-top border-secondary">
                  <p className="text-white small text-center mb-0">Haven System CRM v1.0.0<br/>Secure Connection Established.</p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}