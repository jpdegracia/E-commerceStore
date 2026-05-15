"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { prisma } from "../lib/db"; // Your trusty database singleton

export async function loginCustomer(form: FormData) {
  const email = form.get("email") as string;
  const password = form.get("password") as string;

  // 1. Check if the user exists in the database
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: "Invalid credentials. Please try again.", field: "email" };
  }

  // 2. Compare the typed password with the hashed password in the DB
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return { error: "Invalid credentials. Please try again.", field: "password" };
  }

  // 3. Success! AWAIT the cookies, then set a secure session
  const cookieStore = await cookies(); // <-- We added 'await' here!
  
  cookieStore.set("pilot_session", user.id.toString(), {
    httpOnly: true, // Prevents JavaScript from stealing the cookie
    secure: process.env.NODE_ENV === "production", // Forces HTTPS in production
    maxAge: 60 * 60 * 24 * 7, // 1 week in seconds
    path: "/",
  });

  // 4. Send them back to the shop
  redirect("/dashboard");
}