import {
  SelectOptionRoles,
  AssessmentEditAssigneeRoles,
  AssessmentGetAssigneeRoles,
  assigneeRole,
} from "@/app/types/interfaces"; // Adjust path if needed
import { Role } from "@prisma/client";

// Function to format the assessment as the front end expects on getting an assessment and its associated assignee roles
export function formatAssessmentOnGet(assessment: AssessmentGetAssigneeRoles) {
  const formattedAssessment = {
    ...assessment,
    assignees: assessment
      ? assessment.assigneesRole.map((assigneeRole: assigneeRole) => ({
          name: assigneeRole.user.name,
          email: assigneeRole.user.email,
          role: assigneeRole.role,
          id: assigneeRole.user.id,
        }))
      : [],
  };

  return formattedAssessment;
}

// Function to construct assignee roles data from the selection box data sent, to represent format assignee roles table is expecting
export function constructAssigneeRolesDataForCreate(
  externalExaminers: SelectOptionRoles[],
  internalModerators: SelectOptionRoles[],
  panelMembers: SelectOptionRoles[],
  setter_id: number,
): { user_id: number; role: Role }[] {
  const assigneeRolesData = [
    ...externalExaminers.map((user: SelectOptionRoles) => ({
      user_id: user.value,
      role: Role.external_examiner,
    })),
    ...internalModerators.map((user: SelectOptionRoles) => ({
      user_id: user.value,
      role: Role.internal_moderator,
    })),
    ...panelMembers.map((user: SelectOptionRoles) => ({
      user_id: user.value,
      role: Role.panel_member,
    })),
    {
      user_id: setter_id,
      role: Role.module_leader,
    },
  ];

  return assigneeRolesData;
}

// Function to construct updated assignee roles data from the selection box data sent, to represent format assignee roles table is expecting
export function constructAssigneeRolesDataForUpdate(
  externalExaminers: SelectOptionRoles[],
  internalModerators: SelectOptionRoles[],
  panelMembers: SelectOptionRoles[],
  setter_id: number,
  existingAssessment: AssessmentEditAssigneeRoles,
  roleName: string,
): { user_id: number; role: Role }[] {
  const assigneeRolesData = [
    ...externalExaminers.map((user: SelectOptionRoles) => ({
      user_id: user.value,
      role: Role.external_examiner,
    })),
    ...internalModerators.map((user: SelectOptionRoles) => ({
      user_id: user.value,
      role: Role.internal_moderator,
    })),
    ...panelMembers.map((user: SelectOptionRoles) => ({
      user_id: user.value,
      role: Role.panel_member,
    })),
    ...(roleName === "module_leader"
      ? [{ user_id: setter_id, role: Role.module_leader }]
      : [
          {
            user_id: existingAssessment?.setter_id || setter_id,
            role: Role.module_leader,
          },
        ]),
  ];

  return assigneeRolesData;
}
