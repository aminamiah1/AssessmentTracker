import { Part, Question, Response } from "@prisma/client";

// Manually adding these because Prisma's Type Safety doesn't seem to support
// findUnique return values out of the box?  Maybe I'm doing something wrong...
// https://www.prisma.io/docs/orm/prisma-client/type-safety
declare global {
  interface QuestionWithResponse extends Question {
    Response: Response[];
  }

  interface PartWithQuestions extends Part {
    Question: Question[];
  }

  interface ResponseWithQuestion extends Response {
    Question: Question;
  }
}
