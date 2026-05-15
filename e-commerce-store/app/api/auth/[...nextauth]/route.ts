import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/generated/prisma/enums";

// 1. We extract the config into an exported 'authOptions' variable
export const authOptions: NextAuthOptions = {
  // Tell NextAuth to use your custom login page
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        // Find user in the database
        const user = await prisma.user.findFirst({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error("Invalid email or password.");
        }

        // Compare the hashed password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid email or password.");
        }

        // Return the user object to be saved in the JWT cookie
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          roles: user.roles, 
        };
      }
    })
  ],
  session: {
    strategy: "jwt", 
  },
  callbacks: {
    // Inject custom data into the token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roles = user.roles;
      }
      return token;
    },
    // Pass that token data into the session so your frontend can read it
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.roles = token.roles as Role; // 🚀 No more error!
      }
      return session;
    }
  }
};

// 2. Pass the authOptions to NextAuth down here!
const handler = NextAuth(authOptions);

// 3. Export the handler
export { handler as GET, handler as POST };