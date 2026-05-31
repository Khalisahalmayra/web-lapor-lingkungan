import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const data = await res.json();

        console.log("=================================");
        console.log("LOGIN RESPONSE:", data);
        console.log("TOKEN:", data.token);
        console.log("USER:", data.user);
        console.log("=================================");

        if (!res.ok) {
          return null;
        }

        return {
          id: data.user.id,
          name: data.user.username || data.user.name,
          email: data.user.email,
          role: data.user.role,
          accessToken: data.token,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = (user as any).id;
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      (session.user as any).role = token.role;
      (session.user as any).id = token.id;
      (session as any).accessToken = token.accessToken;

      return session;
    },
  },

  pages: {
    signIn: "/masuk",
    error: "/masuk",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };