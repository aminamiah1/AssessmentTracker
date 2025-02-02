import prisma from "@/app/db";
import { $Enums } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials) {
        if (credentials && credentials.email && credentials.password) {
          const user = await prisma.users.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (
            user &&
            user.password &&
            (await bcrypt.compare(credentials.password, user.password)) &&
            user.status === "active" // Add active user status check
          ) {
            return {
              id: user.id.toString(), // Convert numeric ID to string
              name: user.name,
              email: user.email,
              roles: user.roles,
            };
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Store user ID in JWT
        token.email = user.email;
        token.name = user.name;
        token.roles = user.roles;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = session.user || {};
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.roles = token.roles as $Enums.Role[];
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
  pages: {
    signIn: "/admin/sign-in",
  },
};
