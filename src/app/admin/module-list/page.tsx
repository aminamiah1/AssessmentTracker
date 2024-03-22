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
import { FiFilter } from "react-icons/fi";
import { ModuleStatus } from "@prisma/client";
import { ModuleData } from "@/app/types/module";

export const dynamic = "force-dynamic";

async function getModules(
  searchTerm: string,
  filters: { active: string; archived: string; completed: string },
) {
  const data = await fetch(
    `/api/module-list/${searchTerm}?active=${filters.active}&archived=${filters.archived}&completed=${filters.completed}`,
    {
      next: { revalidate: 3600 },
    },
  );
  return data.json();
}

export default function ModuleList() {
  const { data: session, status } = useSession({ required: true });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [modules, setModules] = useState<ModuleData>([]);
  const [activeFilter, setActiveFilter] = useState<boolean>(true);
  const [archivedFilter, setArchivedFilter] = useState<boolean>(false);
  const [completedFilter, setCompletedFilter] = useState<boolean>(false);

  function onSearch(term: string) {
    setSearchTerm(term);
  }

  async function fetchModules() {
    const filters = {
      active: activeFilter ? "true" : "false",
      archived: archivedFilter ? "true" : "false",
      completed: completedFilter ? "true" : "false",
    };
    const fetchedModules: ModuleData = await getModules(searchTerm, filters);
    setModules(fetchedModules);
  }

  useEffect(() => {
    fetchModules();
  }, [searchTerm, activeFilter, archivedFilter, completedFilter, session]);

  async function handleArchiveModule(moduleCode: string) {
    const res = await archiveModule(moduleCode);
    if (res.error) {
      toast.error(res.error, { position: "bottom-right" });
    } else if (res.success) {
      toast.success(res.success, { position: "bottom-right" });
    } else {
      toast.warn("There was an issue when trying to archive the module.", {
        position: "bottom-right",
      });
    }
    fetchModules();
  }

  function handleFiltering(status: ModuleStatus) {
    switch (status) {
      case "active":
        setActiveFilter(!activeFilter);
        break;
      case "archived":
        setArchivedFilter(!archivedFilter);
        break;
      case "completed":
        setCompletedFilter(!completedFilter);
        break;
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Render the module list if authenticated
  const isPSTeam = session.user.roles.includes("ps_team");
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
          <div className="flex items-center gap-4">
            <div data-cy="search-bar">
              <SearchBar onSearch={onSearch} />
            </div>
            <div className="flex items-center justify-center gap-5 border px-4 py-1 rounded-full">
              <FiFilter className="text-gray-900 dark:text-gray-100" />
              <div className="flex justify-center items-center gap-1">
                <input
                  data-cy="active-filter"
                  className="mt-0.5"
                  onChange={() => handleFiltering(ModuleStatus.active)}
                  type="checkbox"
                  name="active"
                  id="active"
                  checked={activeFilter}
                />
                <label htmlFor="active">Active</label>
              </div>
              <div className="flex justify-center items-center gap-1">
                <input
                  data-cy="archived-filter"
                  className="mt-0.5"
                  onChange={() => handleFiltering(ModuleStatus.archived)}
                  type="checkbox"
                  name="archived"
                  id="archived"
                  checked={archivedFilter}
                />
                <label htmlFor="archived">Archived</label>
              </div>
              <div className="flex justify-center items-center gap-1">
                <input
                  data-cy="completed-filter"
                  className="mt-0.5"
                  onChange={() => handleFiltering(ModuleStatus.completed)}
                  type="checkbox"
                  name="completed"
                  id="completed"
                  checked={completedFilter}
                />
                <label htmlFor="completed">Completed</label>
              </div>
            </div>
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
                  {/* Need to put in the academic year here once it's implemented */}
                  <p>AcaYear-{module.module_code}</p>
                  {module.module_leaders?.length > 0 ? (
                    module.module_leaders.map((module_leader) => (
                      <p> Module Leader: {module_leader.name} </p>
                    ))
                  ) : (
                    <p>No module leaders assigned.</p>
                  )}
                  <p
                    className={`text-sm w-fit mt-2 px-3 pb-0.5 rounded-full text-gray-100 bg-opacity-80 ${module.status === "active" && "bg-green-500"} ${module.status === "archived" && "bg-orange-500"} ${module.status === "completed" && "bg-blue-500"}`}
                  >
                    {module.status}
                  </p>
                </div>
                <div className="flex gap-4">
                  <Link
                    href={`/admin/module-list/edit/${module.module_code}`}
                    data-cy="edit-button"
                    className="px-3 py-2 text-2xl border rounded transition-all bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <MdEdit />
                  </Link>
                  {module.status === "active" && (
                    <button
                      data-cy="archive-button"
                      className="px-3 py-2 text-2xl border rounded transition-all bg-gray-600 dark:bg-gray-600 text-gray-100 hover:bg-gray-700"
                      onClick={() => handleArchiveModule(module.module_code)}
                    >
                      <MdArchive />
                    </button>
                  )}
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
