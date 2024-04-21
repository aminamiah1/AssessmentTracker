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

  const assessment = await prisma.assessment.findFirst({
    where: {
      id: +assessmentId,
    },
    include: {
      setter: true,
      module: true,
      assigneesRole: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!assessment) {
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

  const outstandingPart = await prisma.part.findFirst({
    take: 1,
    orderBy: {
      part_number: "asc",
    },
    where: {
      PartSubmission: {
        none: {
          assessment_id: +assessmentId,
        },
      },
    },
  });

  const assignee = assessment.assigneesRole.find((assignee) => {
    return assignee.role === outstandingPart?.role;
  });

  let assigneeName = assignee?.user.name || "Unknown";
  if (+session.user.id === assignee?.user.id) {
    assigneeName = "You";
  }

  let setterName = assessment.setter?.name || "Unknown";
  if (+session.user.id === assessment.setter?.id) {
    setterName = "You";
  }

  return (
    <div className="flex flex-col pt-100px dark:bg-slate-800">
      <div className="sticky top-1/2 h-0 right-20 transform -translate-y-1/2 flex justify-end items-center">
        <div className="bg-white dark:bg-slate-700 z-10 p-4 shadow-lg text-left">
          <h1
            title={assessment.assessment_name}
            className="max-w-72 leading-10 max-h-24 text-2xl line-clamp-2 font-bold mb-2 text-wrap overflow-ellipsis"
          >
            {assessment.assessment_name}
          </h1>
          <h2 className="text-lg mb-2">
            <span className="font-semibold">Module:</span>{" "}
            {assessment.module?.module_name || "No module linked"}
          </h2>
          <h3 className="text-lg mb-2">
            <span className="font-semibold">Module Code:</span>{" "}
            {assessment.module?.module_code || "No module linked"}
          </h3>
          <p className="text-lg mb-2 ">
            <span className="font-semibold">Setters:</span>{" "}
            {setterName || "Unknown"}
          </p>
          {assignee && (
            <p className="text-lg mb-2 ">
              <span className="font-semibold">Active Assignee:</span>{" "}
              {assigneeName}
            </p>
          )}
          {outstandingPart && (
            <p className="text-lg mb-2 ">
              <span className="font-semibold">Active Part:</span>{" "}
              {finishedParts.length + 1} of 11
            </p>
          )}
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed px-2 py-1 mt-2"
            disabled={!assessment.proforma_link}
          >
            {assessment.proforma_link ? (
              <Link href={assessment.proforma_link}>View Proforma</Link>
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

      <PartTodoByFetch
        disableSubmit={!assessment.proforma_link}
        assessmentId={+assessmentId}
      />
      {!assessment.proforma_link && (
        <p className="text-center mt-[-3rem]">
          Unable to submit without a proforma
        </p>
      )}
    </div>
  );
}
