import { prisma } from "@/app/lib/db";
import { redirect } from "next/navigation";
import EditProductForm from "./EditProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.id);
  
  if (isNaN(productId)) redirect("/admin/products");

  const product = await prisma.product.findUnique({ where: { id: productId }, include: { categories: true } });
  if (!product) redirect("/admin/products");

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="min-vh-100 bg-dark text-white pt-5 mt-4 pb-5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <EditProductForm product={product} categories={categories} />
      </div>
    </div>
  );
}