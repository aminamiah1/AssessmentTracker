"use server";

import prisma from "@/app/db";
import { ModuleStatus } from "@prisma/client";

export async function archiveModule(
  moduleCode: string,
): Promise<{ success?: string; error?: string }> {
  if (!moduleCode) {
    return { error: "There was an error accessing the Module Code." };
  }

  let module;

  try {
    module = await prisma.module.findFirst({
      where: {
        module_code: moduleCode,
      },
      select: {
        id: true,
        status: true,
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

  if (!module) return { error: "Database Error: Could not find module." };

  if (module.status === ModuleStatus.archived)
    return { error: "Database is already marked as archived." };

  try {
    await prisma.module.update({
      where: {
        id: module.id,
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
