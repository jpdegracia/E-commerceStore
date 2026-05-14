"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { prisma } from "../lib/db"; // <-- Import the Prisma Client
import { Cossette_Texte } from "next/font/google";


// Create a new user
export async function createUser(form: FormData) {
    const name = form.get("name") as string;
    const username = form.get("username") as string; // 🚀 Grab the username
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prisma.user.create({
        data: {
            name,
            email,
            username,
            password: hashedPassword,
        },
    });

    revalidatePath("/users");
    redirect("/users");
}

// UPDATE a user
export async function updateUser(form: FormData) {
  // 1. Grab the ID directly from the hidden input we added to the form!
  const id = parseInt(form.get("id") as string);
  
  // 2. Grab the rest of the updated data
  const name = form.get("name") as string;
  const username = form.get("username") as string;
  const email = form.get("email") as string;
  const roles = form.get("roles") as any; // 'any' briefly satisfies Prisma Enum typing

  // 3. Update the database
  await prisma.user.update({
    where: { id },
    data: {
      name,
      username,
      email,
      roles,
    },
  });

  // 4. Return to base
  redirect("/users");
}

// DELETE a user
export async function deleteUser(id: number) {
  await prisma.user.delete({
    where: { id },
  });
  revalidatePath("/users");
}
