import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/app/db";

// API route to deal with the posting of csv module creation data
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return new NextResponse(JSON.stringify({ error: "Must be logged in" }), {
        status: 401,
      });
    }

    const { moduleNames, moduleCodes } = await request.json();

    if (!moduleNames || !moduleCodes) {
      return new NextResponse(
        JSON.stringify({
          message: "Please include all required csv fields to create modules",
        }),
        { status: 400 },
      );
    }

    // Creating the modules with error handling
    for (let i = 0; i < moduleNames.length; i++) {
      try {
        await prisma.module.upsert({
          where: { module_code: moduleCodes[i] }, // Identify by module code
          update: { module_name: moduleNames[i] }, // Update if exists
          create: { module_code: moduleCodes[i], module_name: moduleNames[i] }, // Create the module if not already exists
        });
      } catch (error) {
        console.error(
          `Error creating or updating module ${moduleCodes[i]}`,
          error,
        );
      }
    }

    return new NextResponse("Modules created!", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 },
    );
  }
}
