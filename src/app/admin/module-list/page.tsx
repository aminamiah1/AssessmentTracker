"use client";
import SearchBar from "@/app/components/SearchBar/SearchBar";
import UnauthorizedAccess from "@/app/components/authError";
import { archiveModule } from "@/app/actions/module-status";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdArchive, MdEdit } from "react-icons/md";
import { Users } from "@prisma/client";

export const dynamic = "force-dynamic";

type ModuleData = {
  id: number;
  module_name: string;
  module_code: string;
  module_leaders: Users[];
}[];

async function getModulesPS(searchTerm: string) {
  const data = await fetch(`/api/module-list/${searchTerm}`, {
    next: { revalidate: 3600 },
  });
  return data.json();
}

async function getModulesLeader(searchTerm: string, userId: string) {
  const queryParams = new URLSearchParams({ searchTerm, userId }).toString();
  const data = await fetch(`/api/module-leader/module-list/?${queryParams}`, {
    next: { revalidate: 3600 },
  });
  return data.json();
}

export default function ModuleList() {
  const { data: session, status } = useSession({ required: true });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [userId, setUserId] = useState(session?.user?.id);
  const [modules, setModules] = useState<ModuleData>([]);

  const onSearch = (term: string) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    async function fetchModulesPS() {
      const fetchedModules: ModuleData = await getModulesPS(searchTerm);
      setModules(fetchedModules);
    }
    async function fetchModulesLeader() {
      if (userId) {
        const fetchedModules: ModuleData = await getModulesLeader(
          searchTerm,
          userId,
        );
        setModules(fetchedModules);
      }
    }
    if (isPSTeam) {
      fetchModulesPS();
    } else if (isModuleLeader) {
      fetchModulesLeader();
    }
  }, [searchTerm, session]);

  async function handleArchiveModule(moduleCode: string) {
    const res = await archiveModule(moduleCode);
    if (res.error) {
      toast.error(res.error, { position: "bottom-right" });
    } else if (res.success) {
      toast.success(res.success, { position: "bottom-right" });
    }

    setModules(modules.filter(({ module_code }) => module_code !== moduleCode));
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const isModuleLeader = session.user.roles.includes("module_leader");
  const isPSTeam = session.user.roles.includes("ps_team");
  // Render the module list if authenticated
  return isPSTeam ? (
    <>
      <div className="bg-white dark:bg-darkmode h-screen max-h-full">
        <ToastContainer />
        <h1
          className="text-4xl px-4 py-5 text-gray-900 dark:text-gray-100"
          data-cy="page-title"
        >
          Module List
        </h1>
        {/* Search bar / filtering */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between px-4 py-1">
          <div data-cy="search-bar">
            <SearchBar onSearch={onSearch} />
          </div>
          <div data-cy="create-module-btn">
            <Link
              className="px-4 py-2 min-w-20 border rounded transition-all bg-blue-500 hover:bg-blue-600 text-white"
              href={"/admin/module-list/create"}
            >
              Create Module
            </Link>
          </div>
        </div>
        {/* Grid array of modules, 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full p-4">
          {modules.length > 0 &&
            modules.map((module) => (
              <div
                key={module.id}
                data-cy="module-card"
                className="flex justify-between items-center text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border dark:border-gray-700 shadow-md dark:shadow-gray-500 rounded p-4"
              >
                <div className="mr-4">
                  <h3 className="text-xl">{module.module_name}</h3>
                  <p>Module Code: {module.module_code}</p>
                  {module.module_leaders?.length > 0 ? (
                    module.module_leaders.map((module_leader) => (
                      <p> Module Leader: {module_leader.name} </p>
                    ))
                  ) : (
                    <p>No module leaders assigned.</p>
                  )}
                </div>
                <div className="flex gap-4">
                  <Link
                    href={`/admin/module-list/edit/${module.module_code}`}
                    data-cy="edit-button"
                    className="px-3 py-2 text-2xl border rounded transition-all bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <MdEdit />
                  </Link>
                  <button
                    data-cy="archive-button"
                    className="px-3 py-2 text-2xl border rounded transition-all bg-gray-600 dark:bg-gray-600 text-gray-100 hover:bg-gray-700"
                    onClick={() => handleArchiveModule(module.module_code)}
                  >
                    <MdArchive />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  ) : isModuleLeader ? (
    <>
      <div className="bg-white dark:bg-darkmode h-screen max-h-full mt-6">
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
          {modules.length > 0 ? (
            modules.map((module) => (
              <div
                key={module.id}
                data-cy="module-card"
                className="flex flex-col justify-between text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border dark:border-gray-700 shadow-md dark:shadow-gray-500 rounded p-4"
              >
                <Link
                  href={`/module-leader/module-management/${module.module_code}`}
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
            ))
          ) : (
            <div className="ml-1">No modules found associated with you</div>
          )}
        </div>
      </div>
    </>
  ) : (
    // Default content (if neither)
    <div>
      <UnauthorizedAccess />
    </div>
  );
}
