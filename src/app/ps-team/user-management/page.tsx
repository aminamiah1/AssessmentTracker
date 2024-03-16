"use client";

import UnauthorizedAccess from "@/app/components/authError";
import UsersTable from "@/app/components/ps-team/UsersTable";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import CreateUser from "../../components/ps-team/CreateUser";

export const dynamic = "force-dynamic";

export default function ManageUsersPSTeam() {
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const { data: session, status } = useSession({ required: true });

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const handleCloseCreateUserForm = () => {
    setShowCreateUserForm(false);
  };

  const isPSTeam = session.user.roles.includes("ps_team");
  return isPSTeam ? (
    <div className="bg-white h-screen max-h-full dark:bg-darkmode">
      <ToastContainer />
      <div className="mb-10 mt-20">
        <h1 className="text-3xl font-bold text-black text-center dark:text-white">
          User Management
        </h1>
      </div>
      <div className="text-center">
        {showCreateUserForm ? (
          <CreateUser onClose={handleCloseCreateUserForm} />
        ) : (
          <div>
            <button
              onClick={() => setShowCreateUserForm(true)}
              className="bg-blue-600 text-white py-3 px-6 mt-4 rounded-lg text-lg font-semibold mb-20 mr-4"
            >
              Create New User
            </button>
            <Link href="/ps-team/user-management/upload" passHref>
              <button className="bg-blue-600 text-white py-3 px-6 mt-4 rounded-lg text-lg font-semibold mb-20">
                Import Users
              </button>
            </Link>
          </div>
        )}
      </div>
      <div>
        <UsersTable />
      </div>
    </div>
  ) : (
    <UnauthorizedAccess />
  );
}
