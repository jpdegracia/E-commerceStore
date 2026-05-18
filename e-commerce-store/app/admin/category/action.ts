// app/admin/category/actions.ts
"use server";

import { prisma } from "@/app/lib/db";
import { revalidatePath } from "next/cache";

export async function addCategory(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as string; // 🚀 Add image

    if (!name || !description || !image) {
      return { error: "Name, description, and image are required." };
    }

    const existing = await prisma.category.findFirst({ where: { name } });
    if (existing) return { error: "A category with this name already exists." };

    await prisma.category.create({
      data: { name, description, image }, // 🚀 Save image
    });

    revalidatePath("/admin/category");
    revalidatePath("/admin/products"); 
    return { success: true };
  } catch (error) {
    return { error: "Database error while adding category." };
  }
}

export async function updateCategory(id: number, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as string; // 🚀 Add image

    if (!name || !description || !image) {
      return { error: "Name, description, and image are required." };
    }

    const existing = await prisma.category.findFirst({
      where: { name: name, NOT: { id: id } }
    });

    if (existing) return { error: "Another classification already uses this name." };

    await prisma.category.update({
      where: { id },
      data: { name, description, image }, // 🚀 Save image
    });

    revalidatePath("/admin/category");
    revalidatePath("/admin/products"); 
    return { success: true };
  } catch (error) {
    return { error: "Database error while updating classification." };
  }
}

export async function deleteCategory(id: number) {
  // ... Keep deleteCategory exactly as it is!
  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/category");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2003') return { error: "Cannot delete this category. There are still units assigned to it!" };
    return { error: "Failed to delete category." };
  }
}