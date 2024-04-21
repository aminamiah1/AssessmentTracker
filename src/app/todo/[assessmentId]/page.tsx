"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import ErrorMessage from "@/app/components/ErrorMessage/ErrorMessage";
import { Part, PartTodoByFetch } from "@/app/components/Part/Part";
import prisma from "@/app/db";
import { getServerSession } from "next-auth";
import Link from "next/link";
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
    include: {
      setter: true,
      module: true,
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
    <div className="flex flex-col pt-100px dark:bg-slate-800">
      <div className="sticky top-1/2 h-0 right-20 transform -translate-y-1/2 flex justify-end items-center">
        <div className="z-10 p-4 shadow-lg text-center">
          <h1 className="text-xl font-bold mb-2">
            {assessmentExists.assessment_name}
          </h1>
          <h2 className="text-lg mb-2">
            Module: {assessmentExists.module?.module_name || "No module linked"}
          </h2>
          <h3 className="text-lg mb-2">
            Module: {assessmentExists.module?.module_code || "No module linked"}
          </h3>
          <p className="mb-4 ">
            Setters: {assessmentExists.setter?.name || "Unknown"}
          </p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed px-2 py-1"
            disabled={!assessmentExists.proforma_link}
          >
            {assessmentExists.proforma_link ? (
              <Link href={assessmentExists.proforma_link}>View Proforma</Link>
            ) : (
              "Proforma Unavailable"
            )}
          </button>
        </div>
      </div>
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
