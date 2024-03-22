"use client";
import SearchBar from "@/app/components/SearchBar/SearchBar";
import UnauthorizedAccess from "@/app/components/authError";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Users } from "@prisma/client";

export const dynamic = "force-dynamic";

type ModuleData = {
  id: number;
  module_name: string;
  module_code: string;
  module_leaders: Users[];
}[];

async function getModules(searchTerm: string, userId: string) {
  const queryParams = new URLSearchParams({ searchTerm, userId }).toString();
  const data = await fetch(`/api/module-leader/module-list/?${queryParams}`, {
    next: { revalidate: 3600 },
  });
  return data.json();
}

// Code largely adapted from ps team module list page, only changes here to do with making module leader focused
export default function ModuleList() {
  const { data: session, status } = useSession({ required: true });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [userId, setUserId] = useState(session?.user?.id);
  const [modules, setModules] = useState<ModuleData>([]);

  const onSearch = (term: string) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    async function fetchModules() {
      if (userId) {
        const fetchedModules: ModuleData = await getModules(searchTerm, userId);
        setModules(fetchedModules);
      }
    }
    fetchModules();
  }, [searchTerm, session]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Render the module list if authenticated
  const isModuleLeader = session.user.roles.includes("module_leader");
  return isModuleLeader ? (
    <>
      <div className="bg-white dark:bg-darkmode h-screen max-h-full">
        <ToastContainer />
        <h1
          className="text-4xl px-4 py-5 text-gray-900 dark:text-gray-100"
          data-cy="page-title"
        >
          My Modules List
        </h1>
        {/* Search bar / filtering modules */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between px-4 py-1">
          <div data-cy="search-bar">
            <SearchBar onSearch={onSearch} />
          </div>
        </div>
        {/* Grid array of modules, 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full p-4">
          {modules.length > 0 &&
            modules.map((module) => (
              <div
                key={module.id}
                data-cy="module-card"
                className="flex flex-col justify-between text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border dark:border-gray-700 shadow-md dark:shadow-gray-500 rounded p-4"
              >
                <Link
                  href={`/admin/module-list/${module.module_code}`}
                  className="text-xl hover:underline"
                  data-cy="linked-module"
                >
                  {module.module_name}
                </Link>
                <p>Module Code: {module.module_code}</p>
                {module.module_leaders?.length > 0 ? (
                  module.module_leaders.map((module_leader) => (
                    <p key={module_leader.id}>
                      {" "}
                      Module Leader: {module_leader.name}{" "}
                    </p>
                  ))
                ) : (
                  <p>No module leaders assigned.</p>
                )}
              </div>
            ))}
        </div>
      </div>
    </>
  ) : (
    <UnauthorizedAccess />
  );
}
