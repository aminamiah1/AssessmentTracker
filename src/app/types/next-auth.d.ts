import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role?: Role;
  }

  interface Session {
    user: {
      role?: Role;
      id: string;
    } & DefaultSession["user"];
  }
}
