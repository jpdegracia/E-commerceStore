import { prisma } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import EditCategoryForm from "./EditCategoryForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// 🚀 FIX 1: Tell TypeScript that params is now a Promise
export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  
  // 1. Security Checks
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: parseInt(session.user.id) },
  });
  
  if (user?.roles !== "ADMIN") redirect("/dashboard");

  // 🚀 FIX 2: "await" the params before reading the ID!
  const resolvedParams = await params;
  const categoryId = parseInt(resolvedParams.id);
  
  if (isNaN(categoryId)) redirect("/admin/category");

  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  });

  if (!category) redirect("/admin/category");

  return (
    <div className="min-vh-100 bg-dark text-white pt-5 mt-4 pb-5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        
        <EditCategoryForm category={category} />

      </div>
    </div>
  );
}