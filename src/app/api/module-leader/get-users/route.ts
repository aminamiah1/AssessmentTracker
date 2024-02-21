import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  // Get all users
  try {
    const session = await getServerSession();

    if (!session) {
      return Response.json({ error: "Must be logged in" }, { status: 401 });
    }

    const users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        roles: true,
      },
    });
    return Response.json(users);
  } finally {
    await prisma.$disconnect(); // Ensure connection closure
  }
}
