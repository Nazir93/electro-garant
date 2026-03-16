import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials) {
        const adminEmail =
          process.env.ADMIN_EMAIL || "admin@garantmontazh.ru";
        const adminSecret = process.env.ADMIN_SECRET;

        if (!adminSecret) {
          console.error("[AUTH] ADMIN_SECRET is not set");
          return null;
        }

        if (
          credentials?.email === adminEmail &&
          credentials?.password === adminSecret
        ) {
          return { id: "1", email: adminEmail, name: "Администратор" };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-me",
};
