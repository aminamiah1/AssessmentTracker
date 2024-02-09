import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    //Get all users
    const users = await prisma.users.findMany();
    return Response.json(users);
}