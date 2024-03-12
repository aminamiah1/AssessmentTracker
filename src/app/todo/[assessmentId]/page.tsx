"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { PartTodoByFetch } from "@/app/components/Part/Part";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface PageProps {
  params: { assessmentId: string };
}

export default async function Page({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/api/auth/signin");

  const { assessmentId } = params;

  return (
    <>
      <div className="text-center">
        <h1 className={`text-3xl text-black dark:text-white`}></h1>
      </div>
      <PartTodoByFetch assessmentId={+assessmentId} />
    </>
  );
}
