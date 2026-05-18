// app/admin/products/actions.ts
"use server";

import { prisma } from "@/app/lib/db";
import { revalidatePath } from "next/cache";

export async function addProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseInt(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const categoryId = parseInt(formData.get("categoryId") as string);
    const image = formData.get("image") as string;

    if (!name || !description || isNaN(price) || isNaN(categoryId) || !image) {
      return { error: "All fields are required." };
    }

    await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock: isNaN(stock) ? 0 : stock,
        categoryId,
        image,
      },
    });

    // This tells Next.js to refresh the page data instantly!
    revalidatePath("/admin/products"); 
    return { success: true };
  } catch (error) {
    console.error("Failed to add product:", error);
    return { error: "Failed to add product to the database." };
  }
}

export async function deleteProduct(id: number) {
  try {
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete product." };
  }
}