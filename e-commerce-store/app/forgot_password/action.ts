"use server";

import { prisma } from "@/app/lib/db"; // Adjust path if needed
import crypto from "crypto";

export async function generateResetToken(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required." };
  }

  // 1. Check if the user actually exists
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return { success: true }; 
  }

  // 2. Generate a secure random token and expiration date
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour from now

  // 3. Use userId to delete old tokens
  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id }
  });

  // 4. 🚀 FIX: Changed 'expiresAt' back to 'expires' to match your schema!
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expires // This is shorthand for expires: expires
    }
  });

  // 5. MOCK EMAIL SENDING
  const resetLink = `http://localhost:3000/reset_password?token=${token}`;
  console.log("=========================================");
  console.log("📧 MOCK EMAIL SENT TO:", email);
  console.log("🔗 RESET LINK:", resetLink);
  console.log("=========================================");

  return { success: true };
}