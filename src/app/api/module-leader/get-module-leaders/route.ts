import prisma from "@/app/db";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      // If there is no session, the user is unauthenticated
      return new NextResponse(JSON.stringify({ message: "Forbidden" }), {
        status: 403,
      });
    }
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 },
    );
  }

  if (req.method === "GET") {
    try {
      const moduleLeaders = await prisma.users.findMany({
        where: {
          roles: {
            has: "module_leader",
          },
        },
        select: {
          id: true,
          name: true,
        },
      });

      return NextResponse.json(moduleLeaders);
    } catch (error) {
      console.error("Request error", error);
      return new NextResponse("Error fetching module leaders", { status: 500 });
    }
  } else {
    return new NextResponse("Method not allowed", { status: 405 });
  }
}
