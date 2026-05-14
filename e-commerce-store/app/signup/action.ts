"use server";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
// Use your singleton from earlier!
import { prisma } from "../lib/db"; 

export async function registerCustomer(form: FormData) {
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    
    // Securely hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create the user in the database
    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    // Send them back to the landing page so they can start shopping!
    redirect("/dashboard");
}