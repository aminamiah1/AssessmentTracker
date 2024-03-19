"use server";

import prisma from "@/app/db";
import { ModuleStatus } from "@prisma/client";

export async function archiveModule(
  moduleCode: string,
): Promise<{ success?: string; error?: string }> {
  if (!moduleCode) {
    return { error: "There was an error accessing the Module Code." };
  }

  let moduleId;

  try {
    moduleId = await prisma.module.findFirst({
      where: {
        module_code: moduleCode,
      },
      select: {
        id: true,
      },
    });
  } catch (error) {
    console.error(
      `Database Error: An error occurred while trying to fetch the module ID =>\n${error}`,
    );
    return {
      error:
        "Database Error: An error occurred while trying to fetch the module ID.",
    };
  }

  if (!moduleId) return { error: "Database Error: Could not find module." };

  try {
    await prisma.module.update({
      where: {
        id: moduleId.id,
      },
      data: {
        status: ModuleStatus.archived,
      },
    });
  } catch (error) {
    console.error(`Database Error: Failed to edit Module Status =>\n${error}`);
    return { error: "Database Error: Failed to edit Module Status." };
  }

  return { success: `Successfully archived module ${moduleCode}` };
}
