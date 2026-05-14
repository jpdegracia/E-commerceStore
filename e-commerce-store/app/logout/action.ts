"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function disconnectPilot() {
  // 1. Await the cookies just like we did in the login function
  const cookieStore = await cookies();
  
  // 2. Delete the session cookie
  cookieStore.delete("pilot_session");

  // 3. Send them back to the login screen
  redirect("/");
}