import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return Response.json({ error: "Must be logged in" }, { status: 401 });
    }

    // Validate and extract userId from query parameters
    const url = new URL(request.url);
    const idString = url.searchParams.get("id");
    const userId = parseInt(idString as any, 10);

    if (!userId) {
      throw new Error("Missing userId query parameter");
    }

    if (isNaN(userId)) {
      throw new Error("Invalid userId format");
    }

    // Fetch assessments with error handling
    const modules = await prisma.users.findMany({
      where: { id: userId },
      select: {
        modules: true,
      },
    });

    return Response.json(modules);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to retrieve assessments" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
