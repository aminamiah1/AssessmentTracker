import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    roles?: Role;
  }

  interface Session {
    user: {
      roles: Role;
      id: string;
    } & DefaultSession["user"];
  }
}
