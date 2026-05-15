import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"
// 🚀 1. Import your Role enum directly from the Prisma Client
import { Role } from "@prisma/client" 

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      // 🚀 2. Change 'string' to 'Role'
      roles: Role; 
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    // 🚀 3. Change 'string' to 'Role'
    roles: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    // 🚀 4. Change 'string' to 'Role'
    roles: Role;
  }
}