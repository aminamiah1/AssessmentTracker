import {
  Assessment,
  AssigneeRole,
  Part,
  PartSubmission,
  Question,
  Response,
  Users,
} from "@prisma/client";

// Manually adding these because Prisma's Type Safety doesn't seem to support
// findUnique return values out of the box?  Maybe I'm doing something wrong...
// https://www.prisma.io/docs/orm/prisma-client/type-safety
declare global {
  interface AssessmentWithPartSubmission extends Assessment {
    assigneesRole: AssigneeRoleWithUser[];
    partSubmissions: PartSubmission[];
    module: { module_code: string; module_name: string };
  }

  interface AssessmentAndPartAPIResponse {
    assessment: AssessmentWithPartSubmission;
    part: PartWithQuestionsAndResponses;
  }

  interface AssigneeRoleWithUser extends AssigneeRole {
    user: { name: string };
  }

  interface PartWithQuestions extends Part {
    Question: Question[];
  }

  interface PartWithQuestionsAndResponses extends PartWithQuestions {
    Question: QuestionWithResponse[];
  }

  interface QuestionWithResponse extends Question {
    Response: Response[];
  }
}
