import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/app/db";

interface ModuleIdsByCode {
  [moduleCode: string]: number; // String keys, number values
}

// API route to deal with the posting of csv assessment creation data
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return new NextResponse(JSON.stringify({ error: "Must be logged in" }), {
        status: 401,
      });
    }

    // Use example date for now until we discuss date format as a team
    const example_date = new Date(2024, 1, 26);

    const { moduleCodes, assessmentNames, assessmentTypes } =
      await request.json();

    if (!moduleCodes || !assessmentNames || !assessmentTypes) {
      return new NextResponse(
        JSON.stringify({
          message: "Please include all required csv fields to create modules",
        }),
        { status: 400 },
      );
    }

    // Get module primary key ids by the module codes
    const existingModules = await prisma.module.findMany({
      where: { module_code: { in: moduleCodes } },
      select: { id: true, module_code: true }, // Select only ID and module_code
    });

    // Creating the assessments with error handling
    for (let i = 0; i < assessmentNames.length; i++) {
      try {
        const existingModule = existingModules.find(
          (module) => module.module_code === moduleCodes[i],
        );

        if (!existingModule) {
          console.warn(`Module not found for code: ${moduleCodes[i]}`);
          continue;
        }

        const moduleId = existingModule.id;

        await prisma.assessment.upsert({
          where: {
            assessment_name_module_id: {
              // Identification of assessment by unique name within a module
              assessment_name: assessmentNames[i],
              module_id: moduleId,
            },
          },
          update: {
            assessment_name: assessmentNames[i],
            assessment_type: assessmentTypes[i].replaceAll(" ", "_"),
            hand_in_week: example_date,
            hand_out_week: example_date,
            module: { connect: { id: moduleId } },
          }, // Update if exists
          create: {
            assessment_name: assessmentNames[i],
            assessment_type: assessmentTypes[i].replaceAll(" ", "_"),
            hand_in_week: example_date,
            hand_out_week: example_date,
            module: { connect: { id: moduleId } },
          }, // Else create the assessment
        });
      } catch (error) {
        console.error(
          `Error creating or updating assessment ${assessmentNames[i]}`,
          error,
        );
      }
    }

    return new NextResponse("Assessments created!", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 },
    );
  }
}
