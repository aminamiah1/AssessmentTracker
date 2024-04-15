"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import ErrorMessage from "@/app/components/ErrorMessage/ErrorMessage";
import { Part, PartTodoByFetch } from "@/app/components/Part/Part";
import prisma from "@/app/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface PageProps {
  params: { assessmentId: string };
}

export default async function Page({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/api/auth/signin");

  const { assessmentId } = params;

  if (isNaN(+assessmentId)) {
    return (
      <ErrorMessage message={`Cannot convert '${assessmentId}' to a number`} />
    );
  }

  const assessmentExists = await prisma.assessment.findFirst({
    where: {
      id: +assessmentId,
    },
  });

  if (!assessmentExists) {
    return (
      <ErrorMessage message={`No assessment found with id '${assessmentId}'`} />
    );
  }

  const finishedParts = await prisma.part.findMany({
    where: {
      PartSubmission: {
        some: {
          assessment_id: +assessmentId,
        },
      },
    },
    include: {
      Question: {
        include: {
          Response: {
            where: {
              assessment_id: +assessmentId,
            },
          },
        },
      },
    },
  });

  return (
    <div className="text-center w-full flex flex-col items-center dark:bg-slate-800">
      {finishedParts.map((part) => {
        return (
          <Part
            key={part.id}
            part={part}
            assessmentId={+assessmentId}
            readonly={true}
          />
        );
      })}

      <PartTodoByFetch assessmentId={+assessmentId} />
    </div>
  );
}
