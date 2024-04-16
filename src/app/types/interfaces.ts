import { ModuleStatus } from "@prisma/client";

// Interface for the assessment model to work with form(e.g. react select boxes)
export interface AssessmentForm {
  id: number;
  assessment_name: string;
  assessment_type: { value: string } | { value: string; label: string }; // Assessment type is taken from the prisma enum
  hand_out_week: Date;
  hand_in_week: Date;
  module: { value: string }[] | { value: string; label: string }[]; // Allow the react select format to also be used for the module
  setter_id: number;
  assignees: { value: number }[] | { value: number; label: string }[]; // Allow the react select format to also be used for the assignees
  proforma_link: string | undefined;
}
// Interface for the module model
export interface Module {
  id: number;
  module_name: string;
  module_code: string;
  module_leaders: User[];
  assessments: AssessmentTiles[];
}
// Interface for the user model
export interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  roles: [];
}
// Interface for loading the assessment from database
export interface AssessmentLoad {
  id: number;
  assessment_name: string;
  assessment_type: string;
  hand_out_week: Date;
  hand_in_week: Date;
  module_id: number;
  module: [];
  setter_id: number;
  setter: { id: number; name: string; roles: [] };
  module_name: string;
  assignees: [];
  partSubmissions: [];
  proforma_link: string;
}
// Interface for the assessment model form details presented(edit forms)
export interface AssessmentDetails {
  id: number;
  assessment_name: string;
  assessment_type: string; // Assessment type is taken from the prisma enum
  hand_out_week: Date;
  hand_in_week: Date;
  module: { module_name: string }; // Allow the react select format to also be used for the module
  assignees: { value: number }[] | { value: number; label: string }[]; // Allow the react select format to also be used for the assignees
}
//Interface for dealing with the assessment tiles
export interface AssessmentTiles {
  id: number;
  assessment_name: string;
  assessment_type: string;
  hand_out_week: Date;
  hand_in_week: Date;
  module_name: string;
  module: [];
  setter_id: number;
  setter: { id: number; name: string; roles: [] };
  assignees: [];
  partSubmissions: []; // Last part submission associated with assessment
  proforma_link: string;
}
// Interface for the assignees
export interface Assignee {
  id: number;
  name: string;
  roles: [];
}
//Interface for assessment to edit
export interface AssessmentEdit {
  id: number;
  assessment_name: string;
  assessment_type: string;
  hand_out_week: Date;
  hand_in_week: Date;
  module_name: string;
  module: [];
  setter_id: { value: number; label: string };
  setter: { id: number; name: string; roles: [] };
  assignees: { value: number }[] | { value: number; label: string }[];
}
//Interface for part list
export interface Part {
  part_title: string;
}

export interface ModulePS {
  id: number;
  module_name: string;
  module_code: string;
  module_leaders: { id: number; name: string; roles: string[] }[];
  status: ModuleStatus;
}

export interface AssessmentPS {
  id: number;
  assessment_name: string;
  assessment_type: string;
  hand_out_week: Date;
  hand_in_week: Date;
  partSubmissions: [];
  setter_id: number;
  setter: { id: number; name: string; roles: [] };
}

export interface ModuleLeader {
  id: string;
  name: string;
}

export interface SelectOption {
  value: string; // module leader's ID
  label: string; // module leader's name
}
