"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function editModuleName(formData: FormData) {
  const moduleName = formData.get("module-name") as string;
  const moduleCodeInit = formData.get("module-code-init") as string;

  const moduleId = await prisma.module.findFirst({
    where: {
      module_code: moduleCodeInit,
    },
    select: {
      id: true,
    },
  });

  if (!moduleId) throw new Error("Could not find module with that code.");

  await prisma.module.update({
    where: {
      id: moduleId.id,
    },
    data: {
      module_name: moduleName,
    },
  });
}

export async function editModuleCode(formData: FormData) {
  const moduleCode = (formData.get("module-code") as string) || "";
  const moduleCodeInit = formData.get("module-code-init") as string;

  const moduleId = await prisma.module.findFirst({
    where: {
      module_code: moduleCodeInit,
    },
    select: {
      id: true,
    },
  });

  if (!moduleId) throw new Error("Could not find module with that code.");

  await prisma.module.update({
    where: {
      id: moduleId.id,
    },
    data: {
      module_code: moduleCode,
    },
  });
}
