import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id?: string | number;
      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string | number;
    role?: string;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string | number;
    role?: string;
    accessToken?: string;
  }
}