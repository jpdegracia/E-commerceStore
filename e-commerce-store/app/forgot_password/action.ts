"use server";

import { prisma } from "@/app/lib/db";
import crypto from "crypto";
import nodemailer from "nodemailer"; // 🚀 Import Nodemailer

export async function generateResetToken(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required." };
  }

  // 1. Check if user exists
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return { success: true }; 
  }

  // 2. Generate Token & Expiration
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000); 

  // 3. Clear old tokens
  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id }
  });

  // 4. Save new token
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expires 
    }
  });

  // 5. 🚀 CREATE THE GMAIL TRANSPORTER
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  // Create the dynamic link based on your environment
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const resetLink = `${baseUrl}/reset_password?token=${token}`;

  // 6. 🚀 SEND THE ACTUAL EMAIL
  try {
    await transporter.sendMail({
      from: `"Haven System" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "SECURITY ALERT: Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 8px; border-top: 4px solid #ffd700;">
            <h2 style="color: #333;">HAVEN SYSTEM SECURITY</h2>
            <p style="color: #555;">Pilot, a password reset was requested for your account.</p>
            <p style="color: #555;">Click the secure link below to authenticate and enter new credentials. This link will expire in 1 hour.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #ffd700; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px;">RESET PASSWORD</a>
            </div>
            <p style="color: #999; font-size: 12px;">If you did not request this transmission, please ignore this email. Your current credentials remain secure.</p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Email sending failed:", error);
    return { error: "Failed to send the reset email. Please try again later." };
  }

  return { success: true };
}