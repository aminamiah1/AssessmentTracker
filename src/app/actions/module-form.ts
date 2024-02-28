"use server";

import prisma from "@/app/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
  redirect("/admin/module-list");
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
