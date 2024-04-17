import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { getPartSubmissionsForUser } from "../utils/server/assessment";
import { GenericListItem } from "../components/ListItem/GenericListItem";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FaCheckCircle } from "react-icons/fa";

dayjs.extend(relativeTime);

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  const submissions = await getPartSubmissionsForUser(+session.user.id);
  const userSubmissions = submissions.filter((submission) =>
    session.user.roles.includes(submission.Part.role),
  );

  return (
    <div className="flex items-center flex-col">
      <h1 className="text-2xl mb-8 mt-6">Completed tasks</h1>
      <div data-cy="completed-tasks" className="max-w-fit mx-6">
        {userSubmissions.length ? (
          userSubmissions.map((submission) => {
            const {
              Assessment,
              Submitter,
              Part,
              assessment_id,
              part_id,
              date_submitted,
            } = submission;

            const { module, assessment_name } = Assessment;

            const key = `${assessment_id}-${part_id}`;
            const title = `${module.module_code} | ${assessment_name}`;

            let submitterName = Submitter.name;
            // We want the user to see 'you' if they submitted the part; else
            // they should see the person's name who submitted the part
            if (+session.user.id === Submitter.id) {
              submitterName = "you";
            }

            // Hardcoded for now, as we only have 11 parts... Any need to
            // change this really?
            const sideText = `Part ${Part.part_number} of 11`;

            return (
              <div className="flex items-center my-6">
                <GenericListItem
                  key={key}
                  href={`/todo/${assessment_id}#${part_id}`}
                  className="!rounded-lg dark:shadow-slate-900 dark:hover:shadow-black shadow-[3px_3px_8px] hover:shadow-[4px_4px_12px] shadow-slate-800 hover:shadow-slate-700"
                  title={title}
                  subtitle={Part.part_title}
                  sideText={sideText}
                />
                <FaCheckCircle className="min-w-max ml-5 mr-2 fill-lime-500" />
                <span
                  className="wrap-word-break"
                  title={`${dayjs(date_submitted)}`}
                >
                  Submitted {dayjs(date_submitted).fromNow()} by {submitterName}
                </span>
              </div>
            );
          })
        ) : (
          <span>No completed tasks</span>
        )}
      </div>
    </div>
  );
}
