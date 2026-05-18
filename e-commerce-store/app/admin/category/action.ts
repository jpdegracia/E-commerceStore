"use server";

import { prisma } from "@/app/lib/db";
import { revalidatePath } from "next/cache";

export async function addCategory(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    if (!name || !description) {
      return { error: "Name and description are required." };
    }

    // Check if category already exists to prevent duplicates
    const existing = await prisma.category.findFirst({
      where: { name }
    });

    if (existing) {
      return { error: "A category with this name already exists." };
    }

    await prisma.category.create({
      data: {
        name,
        description,
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products"); // Refresh products page too so the dropdown updates!
    return { success: true };
  } catch (error) {
    console.error("Failed to add category:", error);
    return { error: "Database error while adding category." };
  }
}

export async function deleteCategory(id: number) {
  try {
    await prisma.category.delete({
      where: { id },
    });
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error: any) {
    // If the database blocks the deletion because products are attached
    if (error.code === 'P2003') {
      return { error: "Cannot delete this category. There are still units assigned to it!" };
    }
    return { error: "Failed to delete category." };
  }
}