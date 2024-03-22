import { Module, Users } from "@prisma/client";

export type ModuleData = (Module & {
  module_leaders: Users[];
})[];
