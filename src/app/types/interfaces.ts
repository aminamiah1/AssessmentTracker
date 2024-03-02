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
}
// Interface for the module model
export interface Module {
  id: number;
  module_name: string;
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
  module_name: string;
  assignees: [];
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
  module_id: number;
  module: [];
  setter_id: number;
  setter: { name: string };
  module_name: string;
  assignees: [];
}
