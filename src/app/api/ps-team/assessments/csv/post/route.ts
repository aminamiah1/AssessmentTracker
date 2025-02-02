import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/app/db";

// API route to handle the posting of CSV assessment creation data
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return new NextResponse(JSON.stringify({ error: "Must be logged in" }), {
        status: 401,
      });
    }

    const {
      moduleCodes,
      assessmentNames,
      assessmentTypes,
      calculatedHandOutDates,
      calculatedHandInDates,
    } = await request.json();

    if (
      !moduleCodes ||
      !assessmentNames ||
      !assessmentTypes ||
      !calculatedHandOutDates ||
      !calculatedHandInDates
    ) {
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
        // Find the existing module for the current assessment
        const existingModule = existingModules.find(
          (module) => module.module_code === moduleCodes[i],
        );

        // If module not found, log a warning and continue to next iteration
        if (!existingModule) {
          console.warn(`Module not found for code: ${moduleCodes[i]}`);
          continue;
        }

        // Get module id from the found module
        const moduleId = existingModule.id;

        // Upsert (update or create) the assessment in the database
        await prisma.assessment.upsert({
          where: {
            assessment_name_module_id_hand_out_week_hand_in_week: {
              // Identification of assessment by unique name and module id and hand out and hand in date within a module to
              // prevent duplication and instead update existing assessments with the same details
              assessment_name: assessmentNames[i],
              module_id: moduleId,
              hand_out_week: calculatedHandOutDates[i],
              hand_in_week: calculatedHandInDates[i],
            },
          },
          update: {
            assessment_name: assessmentNames[i],
            assessment_type: assessmentTypes[i].replaceAll(" ", "_"),
            hand_in_week: calculatedHandInDates[i],
            hand_out_week: calculatedHandOutDates[i],
            module: { connect: { id: moduleId } },
          }, // Update if exists
          create: {
            assessment_name: assessmentNames[i],
            assessment_type: assessmentTypes[i].replaceAll(" ", "_"),
            hand_in_week: calculatedHandInDates[i],
            hand_out_week: calculatedHandOutDates[i],
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
