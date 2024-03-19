"use client";

import { useTasks } from "@/app/hooks/useAssessments";
import dynamic from "next/dynamic";

const ProgressListItem = dynamic(() =>
  import("@/app/components/ListItem/ProgressListItem").then(
    (m) => m.ProgressListItem,
  ),
);

interface TaskListProps {
  /** The name of the list item to populate the TaskList with - leaving
   * this in to support future list items (e.g. detailed items, grid items
   * etc.)
   */
  itemTemplateName: "ProgressListItem";

  /** The user whose tasks should be fetched */
  userId: number;
}

export function TaskList({ itemTemplateName, userId }: TaskListProps) {
  const { tasks, isLoading, error } = useTasks(userId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (tasks.length === 0) return <div>No tasks! 🎉</div>;

  let ItemTemplate: React.ComponentType<any>;
  switch (itemTemplateName) {
    case "ProgressListItem":
      ItemTemplate = ProgressListItem;
      break;
    default:
      return <div>Unknown item template: {itemTemplateName}</div>;
  }

  if (!ItemTemplate) return <div>Loading...</div>;

  return (
    <div data-cy="task-list-container">
      {tasks.map((task) => {
        const { id: assessmentId } = task.assessment;

        const responseCount = task.part.Question.reduce(
          (acc, question) =>
            acc + (hasResponse(question, assessmentId) ? 1 : 0),
          0,
        );

        const progress = responseCount / task.part.Question.length;
        const questionsRemaining = task.part.Question.length - responseCount;

        let progressText: string;
        switch (questionsRemaining) {
          case 0:
            progressText = "All questions answered, ready for submission!";
            break;
          default:
            progressText = `${questionsRemaining} question${questionsRemaining === 1 ? "" : "s"} remaining`;
        }

        return (
          <ItemTemplate
            key={task.assessment.id}
            progress={progress}
            progressText={progressText}
            subtitle={task.part.part_title}
            title={task.assessment.assessment_name}
            href={`/todo/${task.assessment.id}`}
          />
        );
      })}
    </div>
  );
}

function hasResponse(question: QuestionWithResponse, assessmentId: number) {
  const { Response: responses } = question;

  const response = responses.find((r) => r.assessment_id === assessmentId);

  if (!response) return false;
  else if (response.value === "") return false;

  return true;
}
