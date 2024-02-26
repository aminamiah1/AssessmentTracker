import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "../../../../db";

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return Response.json({ error: "Must be logged in" }, { status: 401 });
    }

    // Extract assessment ID from request query body
    const { id } = await request.json();

    // Validate assessment ID
    if (!id) {
      return new NextResponse(
        JSON.stringify({ message: "Missing assessment ID." }),
        {
          status: 400,
        },
      );
    }

    // Delete assessment with the given ID
    const deletedAssessment = await prisma.assessment.delete({
      where: { id: id },
    });

    // Check if assessment was found and deleted
    if (!deletedAssessment) {
      return new NextResponse(
        JSON.stringify({ message: "Assessment is deleted!" }),
        {
          status: 200,
        },
      );
    }

    // Respond with success message or redirect
    return new NextResponse(
      JSON.stringify({ message: "Assessment deletion successful!" }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error deleting assessment:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error internal server error." }),
      {
        status: 500,
      },
    );
  } finally {
    // Close Prisma client connection
    await prisma.$disconnect();
  }
}
