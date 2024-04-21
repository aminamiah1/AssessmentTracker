"use client";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

interface UserMenuProps {
  isOpen: boolean;
}

const containerId = "toast-container-email-opt-in";

const UserMenu: React.FC<UserMenuProps> = ({ isOpen }) => {
  const { data: session, status } = useSession({ required: true });
  const [isOptedInForEmails, setIsOptedInForEmails] = useState(false);

  useEffect(() => {
    if (!session) return;

    if (session.user.id) {
      const storageKey = `user_${session.user.id}_opted_in`;
      const optedInStatus = localStorage.getItem(storageKey);
      setIsOptedInForEmails(optedInStatus === "true");
    }
  }, [session]);

  if (!isOpen) return <></>;

  const handleOptInChange = async () => {
    const optIn = !isOptedInForEmails;
    setIsOptedInForEmails(optIn);
    localStorage.setItem(`user_${session?.user.id}_opted_in`, String(optIn));

    await fetch("/api/opt-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: session?.user.id,
        optIn: optIn,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success("Your preferences have been updated.", {
          containerId,
          position: "top-center",
        });
      })
      .catch((error) => {
        console.error("Failed to update opt-in status:", error);
        toast.error("An error occurred while updating your preferences.", {
          containerId,
          position: "top-center",
        });
      });
  };

  const sessionIsReady = status === "authenticated" && session;

  return (
    <div
      className="fixed top-0 right-0 flex justify-end items-start z-[700] mt-20 mr-1 bg-white"
      data-cy="profileMenu"
    >
      <div className="bg-white border-2 shadow-md border-grey-300 dark:border-gray-700 pl-4 pr-4 dark:bg-gray-800">
        {!sessionIsReady && <FaSpinner className="animate-spin" />}
        {sessionIsReady && (
          <>
            <ToastContainer containerId={containerId} />
            {/* User Details */}
            <div className="my-6">
              <p className="font-bold">Full Name</p>
              <p className="mb-4">{session.user.name}</p>
            </div>
            <div className="my-6">
              <p className="font-bold">Email</p>
              <p className="mb-4">{session.user.email}</p>
            </div>
            <div className="my-6">
              <p className="font-bold">Roles</p>
              {session.user.roles.map((role) => (
                <p key={role} className="mb-2">
                  {role.replaceAll("_", " ")}
                </p>
              ))}
            </div>
            {/* Toggle Switch */}
            <div
              className="mb-2 flex cursor-pointer"
              data-cy="toggle-email-reminders"
              onClick={handleOptInChange}
              onKeyDown={async (e) => {
                switch (e.key) {
                  case " ":
                  case "Enter":
                    await handleOptInChange();
                  default:
                    break;
                }
              }}
              tabIndex={0}
            >
              <label
                htmlFor="opt-in-email"
                className="mr-4 font-bold flex cursor-pointer items-center"
              >
                Email Reminders
              </label>
              <input
                hidden
                id="opt-in-email"
                type="checkbox"
                value={isOptedInForEmails ? "on" : "off"}
              />
              <span
                className={`relative w-12 rounded-[50px] transition-colors duration-200 ${isOptedInForEmails ? "bg-green-400 dark:bg-green-500" : "bg-gray-400 dark:bg-gray-500"}`}
                data-cy="optInToggle"
              >
                <span
                  className={`absolute w-4 h-4 top-1 shadow-md bg-white rounded-full transition-transform duration-200 ${isOptedInForEmails ? "translate translate-x-7" : "translate translate-x-1"}`}
                />
              </span>
              <span data-cy="email-preference" className="ml-2 min-w-[2rem]">
                {isOptedInForEmails ? "ON" : "OFF"}
              </span>
            </div>

            <div className="w-full flex justify-center my-6">
              {/* Sign out button */}
              <button
                data-cy="sign-out-button"
                className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 text-white px-4 py-2 rounded-md"
                onClick={() => signOut()}
              >
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserMenu;
