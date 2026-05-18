// app/admin/products/page.tsx
import { prisma } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ProductClient from "./ProductClient";

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);

  // 1. Security Check: Only allow logged-in users
  if (!session?.user?.id) {
    redirect("/login");
  }

  // 2. Fetch user to verify ADMIN role
  const user = await prisma.user.findUnique({
    where: { id: parseInt(session.user.id) },
  });

  if (user?.roles !== "ADMIN") {
    redirect("/dashboard"); // Kick normal users back to dashboard
  }

  // 3. Fetch all Products and Categories from the database
  const products = await prisma.product.findMany({
    include: { category: true }, // Include category details!
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-vh-100 bg-dark text-white pt-5 mt-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="container">
        <h2 className="mb-4 text-warning" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1.2rem' }}>
          HANGAR INVENTORY MANAGEMENT
        </h2>
        
        {/* Pass the data to our interactive Client Component */}
        <ProductClient initialProducts={products} categories={categories} />
      </div>
    </div>
  );
}