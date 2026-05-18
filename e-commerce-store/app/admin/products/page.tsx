import { prisma } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ProductClient from "./ProductClient";
import { Package, ArrowLeft, PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: parseInt(session.user.id) },
  });
  if (user?.roles !== "ADMIN") redirect("/dashboard");

  // Only fetch products here now, no need for categories on the table view!
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-vh-100 bg-dark text-white pt-5 mt-4 pb-5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="container">
        
        <div className="mb-4">
          <Link href="/admin" className="crm-back-link text-white btn btn-secondary d-inline-flex align-items-center gap-2">
            <ArrowLeft size={16} />
            <span className="small fw-bold text-uppercase">Back to Command Center</span>
          </Link>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <Package className="text-success me-3" size={32} />
            <h2 className="mb-0 text-success" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1.2rem' }}>
              PRODUCT INVENTORY
            </h2>
          </div>
          
          <Link href="/admin/products/add_product" className="btn btn-success fw-bold text-dark d-flex align-items-center gap-2">
            <PlusCircle size={18} /> Add Unit
          </Link>
        </div>
        
        <ProductClient initialProducts={products} />
      </div>
    </div>
  );
}