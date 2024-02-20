import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" },
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
            (await bcrypt.compare(credentials.password, user.password))
          ) {
            return {
              id: user.id.toString(), // Convert numeric ID to string
              name: user.name,
              email: user.email,
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
      if (token) {
        session.user.id = token.id as string; // Ensure the ID is a string
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.roles = token.roles as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl + "/admin/homepage";
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
