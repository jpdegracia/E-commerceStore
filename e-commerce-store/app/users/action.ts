"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { prisma } from "../lib/db"; // <-- Import the Prisma Client


// Create a new user
export async function createUser(form: FormData) {
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    revalidatePath("/users");
    redirect("/users");
}

// UPDATE a user
export async function updateUser(id: number, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  await prisma.user.update({
    where: { id },
    data: { name, email },
  });

  revalidatePath("/users");
  redirect("/users");
}

// DELETE a user
export async function deleteUser(id: number) {
  await prisma.user.delete({
    where: { id },
  });
  revalidatePath("/users");
}
