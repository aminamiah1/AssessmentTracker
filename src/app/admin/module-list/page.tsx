"use client";

import SearchBar from "@/app/components/SearchBar/SearchBar";
import UnauthorizedAccess from "@/app/components/authError";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";

export const dynamic = "force-dynamic";

type ModuleData = {
  id: number;
  module_name: string;
  module_code: string;
}[];

async function getModules(searchTerm: string) {
  const data = await fetch(`/api/module-list/${searchTerm}`, {
    next: { revalidate: 3600 },
  });
  return data.json();
}

export default function ModuleList() {
  const { data: session, status } = useSession({ required: true });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [modules, setModules] = useState<ModuleData>([]);

  const onSearch = (term: string) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    async function fetchModules() {
      const fetchedModules: ModuleData = await getModules(searchTerm);
      setModules(fetchedModules);
    }
    if (session) {
      // Fetch modules only if the session exists
      fetchModules();
    }
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
                className="module-card flex justify-between items-center text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border dark:border-gray-700 shadow-md dark:shadow-gray-500 rounded p-4"
              >
                <div className="mr-4">
                  <h3 className="text-xl">{module.module_name}</h3>
                  <p>Module Code: {module.module_code}</p>
                </div>
                <div className="flex gap-4">
                  <Link
                    href={`/admin/module-list/edit/${module.module_code}`}
                    className="edit-button px-3 py-2 text-2xl border rounded transition-all bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <MdEdit />
                  </Link>
                  <button className="delete-button px-3 py-2 text-2xl border rounded transition-all bg-red-600 dark:bg-red-800 text-gray-100 hover:bg-red-700">
                    <MdDelete />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  ) : (
    <UnauthorizedAccess />
  );
}
