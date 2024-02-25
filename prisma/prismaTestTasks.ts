import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

interface PrismaUser {
  email: string;
  name: string;
  password: string;
  roles: Role[];
}

export const prismaCreateUser = async (userData: PrismaUser) => {
  try {
    return await prisma.users.create({
      data: {
        name: userData.name.toString(),
        email: userData.email.toString(),
        password: userData.password.toString(),
        roles: userData.roles,
      },
    });
  } catch (e) {
    console.log("User already exists");
    return null;
  }
};
