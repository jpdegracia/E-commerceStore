import { prisma } from "@/app/lib/db";
import AddProductForm from "./AddProductForm";

export default async function AddProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="min-vh-100 bg-dark text-white pt-5 mt-4 pb-5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <AddProductForm categories={categories} />
      </div>
    </div>
  );
}