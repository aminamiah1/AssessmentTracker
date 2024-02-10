import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
      // Extract user ID from request query parameters or body
      const url = new URL(request.url)
      const idString = url.searchParams.get("id")
       // @ts-ignore
      const id = parseInt(idString, 10);

       if (!id) {
        return new NextResponse(
                JSON.stringify({ message: "Missing user ID." }),
                { status: 400 }
        );
       }  
  
      // Get user with the given ID
      const user = await prisma.users.findUnique({ where: { id } });
  
      // Check if user was found and return details
      if (user) {
        console.log(user);
        return Response.json(user);
      } else {
        console.error('Error retrieving user');
        return new NextResponse(
        JSON.stringify({ message: "Error retrieving user" }),
        {
            status: 404,
        })
      }
    } catch (error) {
      console.error('Error retrieving user:', error);
      return new NextResponse(
        JSON.stringify({ message: "Error internal server error." }),
        {
            status: 500,
        }
    )
    } finally {
      // Close Prisma client connection
      await prisma.$disconnect();
    }
  }