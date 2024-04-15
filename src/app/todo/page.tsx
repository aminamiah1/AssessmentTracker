import { TaskList } from "@/app/components/TaskList/TaskList";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/options";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/api/auth/signin");

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="text-center">
        <h1 className={`text-3xl text-black dark:text-white`}>Task List</h1>
      </div>
      <TaskList
        className="md:min-w-[60vw] mt-6 flex-col"
        itemTemplateName={"ProgressListItem"}
        userId={+session.user.id}
      />
    </div>
  );
}
