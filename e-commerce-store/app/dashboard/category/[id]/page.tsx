import { prisma } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, PackageX } from "lucide-react";

export default async function UserCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Security & Session Check
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: parseInt(session.user.id) },
  });

  // Admins belong in the command center
  if (user?.roles === "ADMIN") redirect("/admin");

  // 2. Safely await Next.js 15 params
  const resolvedParams = await params;
  const categoryId = parseInt(resolvedParams.id);

  if (isNaN(categoryId)) redirect("/dashboard");

  // 3. Fetch the Category AND its active Products in one query
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      products: {
        where: { stock: { gt: 0 } }, // Only show in-stock items to users!
        orderBy: { createdAt: "desc" }
      }
    }
  });

  // If someone types a fake category ID in the URL, kick them back
  if (!category) redirect("/dashboard");

  return (
    <div className="min-vh-100 bg-dark text-white pt-5 mt-4 pb-5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="container">
        
        {/* Back Button */}
        <div className="mb-4">
          <Link 
            href="/dashboard" 
            className="text-decoration-none text-white d-inline-flex align-items-center gap-2 hover-text-warning transition-all"
          >
            <ArrowLeft size={16} />
            <span className="small fw-bold text-uppercase">Back to Hangar</span>
          </Link>
        </div>

        {/* Category Header Banner */}
        <div className="card bg-secondary border-0 shadow-lg mb-5 overflow-hidden rounded-4">
          <div className="row g-0">
            <div className="col-md-4 col-lg-3 d-none d-md-block">
              <img 
                src={category.image} 
                alt={category.name} 
                className="img-fluid h-100 w-100"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="col-md-8 col-lg-9 p-4 p-md-5 d-flex flex-column justify-content-center bg-dark">
              <h2 className="display-6 fw-bold text-info mb-2" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1.5rem' }}>
                {category.name}
              </h2>
              <p className="text-white mb-0 lead fs-6">
                {category.description}
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold text-white">Available Units</h4>
          <span className="badge bg-secondary text-info fs-6 px-3 py-2 border border-secondary">
            {category.products.length} {category.products.length === 1 ? 'Unit' : 'Units'} Found
          </span>
        </div>

        <div className="row g-4">
          {category.products.length === 0 ? (
            <div className="col-12">
              <div className="p-5 border border-secondary border-dashed rounded-4 text-center bg-secondary bg-opacity-25">
                <PackageX className="text-white mb-3" size={48} />
                <h4 className="text-white mb-2">Hangar Empty</h4>
                <p className="text-white mb-0">
                  There are currently no in-stock units available for this classification.
                </p>
              </div>
            </div>
          ) : (
            category.products.map((product) => (
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
                  </div>

                  {/* Product Details */}
                  <div className="card-body bg-dark d-flex flex-column">
                    <h6 className="card-title fw-bold text-white mb-1 lh-base">{product.name}</h6>
                    <p className="card-text text-warning fw-bold mb-3 fs-5 mt-auto">
                      {product.price.toLocaleString()} CR
                    </p>
                    
                    {/* Action Button */}
                    <button className="btn btn-outline-info w-100 fw-bold d-flex align-items-center justify-content-center gap-2 mt-auto">
                      <ShoppingCart size={16} /> 
                      Acquire Unit
                    </button>
                  </div>
                  
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}