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
    const image = formData.get("image") as string;
    
    // 🚀 NEW: Get an array of all checked category IDs
    const categoryIds = formData.getAll("categoryIds").map(id => parseInt(id as string));

    if (!name || !description || isNaN(price) || !image) {
      return { error: "All text fields and image are required." };
    }

    await prisma.product.create({
      data: { 
        name, description, price, stock: isNaN(stock) ? 0 : stock, image,
        // 🚀 NEW: Connect multiple categories at once
        categories: {
          connect: categoryIds.map(id => ({ id }))
        }
      },
    });

    revalidatePath("/admin/products"); 
    return { success: true };
  } catch (error) {
    return { error: "Failed to add product." };
  }
}

export async function updateProduct(id: number, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseInt(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const image = formData.get("image") as string;

    // 🚀 NEW: Get array of checked categories
    const categoryIds = formData.getAll("categoryIds").map(id => parseInt(id as string));

    if (!name || !description || isNaN(price) || !image) {
      return { error: "All text fields and image are required." };
    }

    await prisma.product.update({
      where: { id },
      data: { 
        name, description, price, stock: isNaN(stock) ? 0 : stock, image,
        // 🚀 NEW: Clear old categories (set: []) and connect the new ones
        categories: {
          set: [], 
          connect: categoryIds.map(id => ({ id }))
        }
      },
    });

    revalidatePath("/admin/products"); 
    return { success: true };
  } catch (error) {
    console.error("Failed to update product:", error);
    return { error: "Database error while updating unit." };
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