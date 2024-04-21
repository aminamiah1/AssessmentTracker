"use client";

import { useTasks } from "@/app/hooks/useAssessments";
import { HTMLProps } from "react";
import { ProgressListItem } from "@/app/components/ListItem/ProgressListItem";

// HTMLProps is a useful utility which allows us to extend the HTMLDivElement
// interface with additional props.  In other words, all props that we could
// usually pass through to a <div>, we can pass through to this TaskListProps,
// in addition to the custom props we define here (userId).
interface TaskListProps extends HTMLProps<HTMLDivElement> {
  /** The user whose tasks should be fetched */
  userId: number;
}

export function TaskList({ userId, className, ...props }: TaskListProps) {
  const { tasks, isLoading, error } = useTasks(userId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (tasks.length === 0) return <div>No tasks! 🎉</div>;

  return (
    <div
      data-cy="task-list-container"
      className={`flex flex-col gap-4 ${className}`}
      {...props}
    >
      {tasks.map((task) => {
        const { assigneesRole, id: assessmentId, module } = task.assessment;

        const responseCount = task.part.Question.reduce(
          (acc, question) => acc + hasResponse(question, assessmentId),
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

        const moduleInfo = (
          <div className="flex items-center">
            <span data-cy="module-info" className="w-36">
              {module.module_code} {module.module_name}
            </span>
          </div>
        );

        const moduleLeaders = assigneesRole.filter((role) => {
          return role.role === "module_leader";
        });

        const leaders = (
          <div
            data-cy="module-leaders"
            className="flex flex-col pl-2 border-l h-full"
          >
            {moduleLeaders.length ? (
              <>
                <span className="font-bold text-nowrap">
                  Module Leader{moduleLeaders.length > 1 ? "s" : ""}
                </span>
                <ul>
                  {moduleLeaders.map((assignee) => {
                    return (
                      <li key={assignee.id} className="text-nowrap">
                        {assignee.user.name}
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <span>No module leaders assigned</span>
            )}
          </div>
        );

        return (
          <ProgressListItem
            key={task.assessment.id}
            leftChildren={moduleInfo}
            progress={progress}
            progressText={progressText}
            rightChildren={leaders}
            subtitle={task.part.part_title}
            title={task.assessment.assessment_name}
            proforma={task.assessment.proforma_link}
            href={`/todo/${task.assessment.id}`}
          />
        );
      })}
    </div>
  );
}

function hasResponse(
  question: QuestionWithResponse,
  assessmentId: number,
): number {
  const { Response: responses } = question;

  const response = responses.find((r) => r.assessment_id === assessmentId);

  if (!response) return 0;
  else if (response.value === "") return 0;

  return 1;
}
