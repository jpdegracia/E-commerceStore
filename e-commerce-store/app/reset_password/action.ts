"use server";

import { prisma } from "@/app/lib/db";
import bcrypt from "bcrypt";

export async function resetPassword(formData: FormData) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;

  if (!token || !password) {
    return { error: "Missing required fields." };
  }

  // 1. Find the token in the database
  const existingToken = await prisma.passwordResetToken.findUnique({
    where: { token }
  });

  if (!existingToken) {
    return { error: "Invalid or missing token." };
  }

  // 2. 🚀 FIX: Changed 'expiresAt' back to 'expires'
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "This reset link has expired. Please request a new one." };
  }

  // 3. Find the user using the userId attached to the token
  const user = await prisma.user.findUnique({
    where: { id: existingToken.userId }
  });

  if (!user) {
    return { error: "User no longer exists." };
  }

  // 4. Hash the new password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 5. Update the user's password
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword }
  });

  // 6. Delete the token so it can't be used again
  await prisma.passwordResetToken.delete({
    where: { id: existingToken.id }
  });

  return { success: true };
}