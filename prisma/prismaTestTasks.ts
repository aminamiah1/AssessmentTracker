import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

interface PrismaUser {
  email: string;
  name: string;
  password: string;
  roles: Role[];
}

export const prismaFindUser = async (email: string) => {
  return await prisma.users.findUnique({ where: { email: email.toString() } });
};

export const prismaCreateUser = async (userData: PrismaUser) => {
  return await prisma.users.create({
    data: {
      name: userData.name.toString(),
      email: userData.email.toString(),
      password: userData.password.toString(),
      roles: userData.roles,
    },
  });
};
