import prisma from "../db";

export async function getPartsWithQuestions(): Promise<PartWithQuestions[]> {
  const parts = await prisma.part.findMany({
    include: {
      Question: true,
    },
  });

  return parts;
}
