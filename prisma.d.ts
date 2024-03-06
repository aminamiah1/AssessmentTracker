import {
  Assessment,
  Part,
  PartSubmission,
  Question,
  Response,
} from "@prisma/client";

// Manually adding these because Prisma's Type Safety doesn't seem to support
// findUnique return values out of the box?  Maybe I'm doing something wrong...
// https://www.prisma.io/docs/orm/prisma-client/type-safety
declare global {
  interface AssessmentWithPartSubmission extends Assessment {
    partSubmissions: PartSubmission[];
  }

  interface AssessmentAndPartAPIResponse {
    assessment: AssessmentWithPartSubmission;
    part: PartWithQuestionsAndResponses;
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

  interface ResponseWithQuestion extends Response {
    Question: Question;
  }
}
