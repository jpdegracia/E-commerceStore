import { redirect } from "next/navigation";
import { prisma } from "../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Link from "next/link";
import { ShoppingCart, Grid, Rocket } from "lucide-react";
import CategorySlider from "./CategorySlider";
import { addToCart } from "../cart/action";
import AcquireButton from "./AcquireButton";

// Quick utility to shuffle our product array randomly
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default async function DashboardPage() {
  // 1. Get the session securely via NextAuth
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  // 2. Fetch the logged-in user
  const user = await prisma.user.findUnique({
    where: { id: parseInt(session.user.id) },
  });

  if (!user) {
    redirect("/login");
  }

  // 3. Send Admins straight to their Command Center
  if (user.roles === "ADMIN") {
    redirect("/admin");
  }

  // 4. Fetch Storefront Data
  // Get all categories so pilots can browse by class
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  // Get products, filter out anything with 0 stock, and include category details
  const allProducts = await prisma.product.findMany({
    where: { stock: { gt: 0 } },
    include: { categories: true },
  });

  // Randomize the products and take the first 12 for the dashboard showcase
  const showcasedProducts = shuffleArray(allProducts).slice(0, 12);

  return (
    <div className="min-vh-100 bg-dark text-white pt-5 mt-4 pb-5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="container">
        
        {/* Welcome Banner */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="p-5 bg-secondary rounded-4 shadow-lg border border-secondary position-relative overflow-hidden" style={{ 
              backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.4)), url("https://img.freepik.com/free-vector/gradient-tech-futuristic-background_52683-74267.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div className="position-relative z-1">
                <h1 className="display-5 fw-bold text-white mb-2" style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '1px' }}>
                  Welcome back, Pilot <span className="text-info">{user.username}</span>
                </h1>
                <p className="lead text-light mb-4 opacity-75">
                  Secure connection established. Hangar inventory is ready for deployment.
                </p>
                <div className="mx-4 d-flex gap-2">
                  <Link href="/dashboard/orders">
                    <button className="btn btn-info fw-bold px-4 py-2 text-dark shadow">
                      View Orders
                    </button>
                  </Link>
                  <Link href="/cart">
                    <button className="btn btn-warning fw-bold px-4 py-2 text-dark shadow">
                      View Cart
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🚀 CATEGORIES SECTION */}
        <div className="mb-5">
          <div className="d-flex align-items-center gap-2 mb-3">
            <Grid className="text-info" size={24} />
            <h3 className="mb-0 fw-bold" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1rem' }}>
              BROWSE CLASSIFICATIONS
            </h3>
          </div>
          
          {/* 🚀 Our 2-Row Slider */}
          <CategorySlider categories={categories} />
        </div>

        {/* 🚀 RANDOMIZED PRODUCTS SECTION */}
        <div>
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div className="d-flex align-items-center gap-2">
              <Rocket className="text-warning" size={24} />
              <h3 className="mb-0 fw-bold text-warning" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1rem' }}>
                RECOMMENDED UNITS
              </h3>
            </div>
          </div>

          <div className="row g-4">
            {showcasedProducts.length === 0 ? (
              <div className="col-12 text-white text-center py-5 border border-secondary rounded">
                The hangar is currently empty. Check back later for new arrivals.
              </div>
            ) : (
              showcasedProducts.map((product) => (
                <div key={product.id} className="col-sm-6 col-md-4 col-lg-3">
                  <div className="card bg-secondary border-secondary shadow-sm rounded-4 overflow-hidden h-100 d-flex flex-column">
                    {/* Product Image */}
                    <div className="position-relative">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="card-img-top" 
                        style={{ height: '220px', objectFit: 'cover' }} 
                      />
                      {/* Maps through all attached categories and stacks them */}
                      <div className="position-absolute top-0 end-0 m-2 d-flex flex-column gap-1 align-items-end">
                        {product.categories.length === 0 ? (
                          <span className="badge bg-dark border border-secondary text-muted shadow-sm">
                            Uncategorized
                          </span>
                        ) : (
                          product.categories.map(cat => (
                            <span key={cat.id} className="badge bg-dark border border-secondary text-info shadow-sm">
                              {cat.name}
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="card-body bg-dark d-flex flex-column">
                      <h6 className="card-title fw-bold text-white mb-1 lh-base">{product.name}</h6>
                      <p className="card-text text-warning fw-bold mb-3 fs-5 mt-auto">
                        {product.price.toLocaleString()} PHP
                      </p>
                      <AcquireButton productId={product.id} />

                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}