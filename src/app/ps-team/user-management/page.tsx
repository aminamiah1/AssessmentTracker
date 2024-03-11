"use client";
import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import UsersTable from "../../components/ps-team/UsersTable";
import { ToastContainer } from "react-toastify";
import CreateUser from "../../components/ps-team/CreateUser";
import AuthContext from "@/app/utils/authContext";
import Link from "next/link";
import UnauthorizedAccess from "@/app/components/authError";

export const dynamic = "force-dynamic";

function ManageUsersPSTeam() {
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [isPSTeam, setIsPSTeam] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session != null) {
      const checkRoles = () => {
        const roles = session.user.roles;
        console.log(session.user.roles);
        if (roles.includes("ps_team")) {
          setIsPSTeam(true);
        } else {
          setIsPSTeam(false);
          // Set to false if not part of ps_team
        }
      };

      checkRoles();
    } else if (status === "unauthenticated") {
      // If not an authenticated user then make them sign-in
      signIn();
    }
  }, [session, status]);

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

  // Render the user management interface if authenticated
  return isPSTeam ? (
    <div className="bg-white dark:bg-darkmode h-screen max-h-full">
      <ToastContainer />
      <div className="mb-10 mt-20">
        <h1 className="text-3xl font-bold text-black text-center">
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
              className="bg-gray-800 text-white py-3 px-6 mt-4 rounded-lg text-lg font-semibold mb-20 mr-4"
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

const WrappedManageUsersPSTeam = () => (
  <AuthContext>
    <ManageUsersPSTeam />
  </AuthContext>
);

export default WrappedManageUsersPSTeam;
