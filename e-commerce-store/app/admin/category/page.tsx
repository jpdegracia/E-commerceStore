import { prisma } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import CategoryClient from "./CategoryClient";
import { Tags, ArrowLeft } from "lucide-react"; // 🚀 Added ArrowLeft
import Link from "next/link"; // 🚀 Added Link

export default async function AdminCategoriesPage() {
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

  // Fetch categories AND count how many products belong to each one
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-vh-100 bg-dark text-white pt-5 mt-4 pb-5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="container">
        
        {/* 🚀 NEW BACK BUTTON */}
        <div className="mb-4">
          <Link 
            href="/admin" 
            className="crm-back-link d-inline-flex align-items-center gap-2"
          >
            <ArrowLeft size={16} />
            <span className="small fw-bold text-uppercase">Back to Command Center</span>
          </Link>
        </div>

        <div className="d-flex align-items-center mb-4">
          <Tags className="text-info me-3" size={32} />
          <h2 className="mb-0 text-info" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1.2rem' }}>
            CATEGORY CLASSIFICATIONS
          </h2>
        </div>
        
        <CategoryClient initialCategories={categories} />
      </div>
    </div>
  );
}