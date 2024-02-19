"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

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
