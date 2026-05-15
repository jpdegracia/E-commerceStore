"use server";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { prisma } from "../lib/db"; 

export async function registerCustomer(form: FormData) {
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const username = form.get("username") as string;
    
    if (!name || !email || !password || !username) {
        return { error: "All fields are required.", field: "all" };
    }

    if (password.length < 8) {
        return { error: "Password must be at least 8 characters long.", field: "password" };
    }

    if (!email.includes("@")) {
        return { error: "Please enter a valid email address.", field: "email" };
    }

    // Check Email specifically
    const existingEmail = await prisma.user.findFirst({
        where: { email: email }
    });
    if (existingEmail) {
        return { error: "This email is already registered.", field: "email" }; 
    }

    // Check Username specifically
    const existingUsername = await prisma.user.findFirst({
        where: { username: username }
    });
    if (existingUsername) {
        return { error: "This username is taken. Please choose another.", field: "username" }; 
    }

    // Securely hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create the user
    await prisma.user.create({
        data: {
            name,
            email,
            username,
            password: hashedPassword,
        },
    });

    // Success! Redirect to dashboard
    redirect("/dashboard");
}