"use server";

import prisma from "@/app/db";
import { revalidatePath } from "next/cache";
import { permanentRedirect, redirect } from "next/navigation";

export async function getModuleName(moduleCode: string) {
  if (!moduleCode) return;

  const moduleName = await prisma.module.findFirst({
    where: {
      module_code: moduleCode,
    },
    select: {
      module_name: true,
    },
  });

  if (!moduleName) throw new Error("Could not find module with that code.");

  return moduleName.module_name;
}

export async function editModuleName(formData: FormData) {
  const moduleName = formData.get("module-name") as string;
  const moduleCodeInit = formData.get("module-code-init") as string;

  if (!moduleName) return;

  const moduleId = await prisma.module.findFirst({
    where: {
      module_code: moduleCodeInit,
    },
    select: {
      id: true,
    },
  });

  if (!moduleId) throw new Error("Could not find module with that code.");

  try {
    await prisma.module.update({
      where: {
        id: moduleId.id,
      },
      data: {
        module_name: moduleName,
      },
    });
  } catch (error) {
    throw new Error("Database Error: Failed to edit Module Name.");
  }

  revalidatePath("/admin/module-list");
  permanentRedirect("/admin/module-list");
}

export async function editModuleCode(formData: FormData) {
  const moduleCode = formData.get("module-code") as string;
  const moduleCodeInit = formData.get("module-code-init") as string;

  if (!moduleCode) return;

  const moduleId = await prisma.module.findFirst({
    where: {
      module_code: moduleCodeInit,
    },
    select: {
      id: true,
    },
  });

  if (!moduleId) throw new Error("Could not find module with that code.");

  try {
    await prisma.module.update({
      where: {
        id: moduleId.id,
      },
      data: {
        module_code: moduleCode,
      },
    });
  } catch (error) {
    throw new Error("Database Error: Failed to edit Module Code.");
  }

  revalidatePath("/admin/module-list");
  redirect("/admin/module-list");
}

export async function getModuleLeaders() {
  try {
    const moduleLeaders = await prisma.users.findMany({
      where: {
        roles: {
          has: "module_leader",
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
    return moduleLeaders;
  } catch (error) {
    console.error("Error fetching module leaders:", error);
    throw new Error("Database Error: Failed to fetch module leaders.");
  }
}

export async function updateModuleLeaders(
  moduleCode: string,
  formData: FormData,
): Promise<string> {
  // Update return type to Promise<string> -> indicateS it returns a success message
  const newLeaderIds = formData.getAll("new-leader-ids[]").map(Number);

  if (newLeaderIds.length === 0) {
    throw new Error("At least one new module leader must be provided.");
  }

  const moduleToUpdate = await prisma.module.findFirst({
    where: {
      module_code: moduleCode,
    },
    select: {
      id: true,
    },
  });

  if (!moduleToUpdate) {
    throw new Error("Could not find module with that code.");
  }

  const validModuleLeaders = await prisma.users.findMany({
    where: {
      id: { in: newLeaderIds },
      roles: { has: "module_leader" },
    },
    select: { id: true },
  });

  if (validModuleLeaders.length !== newLeaderIds.length) {
    throw new Error("One or more provided module leader IDs are invalid.");
  }

  try {
    await prisma.module.update({
      where: { id: moduleToUpdate.id },
      data: {
        module_leaders: {
          set: [],
          connect: validModuleLeaders.map((leader) => ({ id: leader.id })), //connects with module leader user id
        },
      },
    });
  } catch (error) {
    console.error("Failed to update module leaders:", error);
    throw error;
  }

  revalidatePath("/admin/module-list"); //updates path
  // permanentRedirect("/admin/module-list");
  return "Success!";
}
