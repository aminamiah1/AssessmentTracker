import { $Enums } from "@prisma/client";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    roles?: $Enums.Role[];
  }

  interface Session {
    user: {
      roles: $Enums.Role[];
      id: string;
    } & DefaultSession["user"];
  }
}
