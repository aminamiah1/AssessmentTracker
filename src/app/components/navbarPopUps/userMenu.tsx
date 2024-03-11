"use client";
import { useSession } from "next-auth/react";

interface UserMenuProps {
  isOpen: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({ isOpen }) => {
  // Control pop-up close
  if (!isOpen) return null;

  //User details from session storage
  const { data: session } = useSession();

  return session != null ? (
    <div
      className="fixed top-0 right-0 flex justify-end items-start z-50 mt-20 mr-1 bg-white"
      style={{ zIndex: "700" }}
    >
      <div className="bg-white border border-grey-100 rounded-lg pl-4 pr-4 dark:bg-gray-800">
        <div className="border-b border-black shadow-md mt-4 mb-4 dark:border-white">
          <p className="mb-1 font-bold">Full Name</p>
          <p className="mb-4">{session.user.name}</p>
        </div>
        <div className="border-b border-black shadow-md mt-4 mb-4 dark:border-white">
          <p className="mb-1 font-bold">Email</p>
          <p className="mb-4">{session.user.email}</p>
        </div>
        <div className="border-b border-black shadow-md mt-4 mb-4 dark:border-white">
          <p className="mb-1 font-bold">Roles</p>
          {/* Map through roles and render each with space instead of underscore for readability */}
          {session.user.roles.map((role: string) => (
            <p key={role} className="mb-2">
              {role.replaceAll("_", " ")}
            </p>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div
      className="fixed top-0 right-0 h-screen w-1/3 flex justify-end items-start z-50 mt-20 mr-1"
      style={{ zIndex: "700" }}
    >
      <div className="bg-white border border-grey-100 rounded-lg pl-4 pr-4">
        <div className="border-b border-black shadow-md mt-4 mb-4">
          <p className="mb-1 font-bold">Not logged in!</p>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
