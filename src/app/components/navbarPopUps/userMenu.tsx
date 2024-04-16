"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

interface UserMenuProps {
  isOpen: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({ isOpen }) => {
  const { data: session } = useSession();
  const [isOptedInForEmails, setIsOptedInForEmails] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      const storageKey = `user_${session.user.id}_opted_in`;
      const optedInStatus = localStorage.getItem(storageKey);
      setIsOptedInForEmails(optedInStatus === "true");
    }
  }, [session?.user?.id]);

  if (!isOpen || !session) {
    return null;
  }

  const handleOptInChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const optIn = event.target.checked;
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
          position: "top-center",
        });
      })
      .catch((error) => {
        console.error("Failed to update opt-in status:", error);
        toast.error("An error occurred while updating your preferences.", {
          position: "top-center",
        });
      });
  };

  return session != null ? (
    <div
      className="fixed top-0 right-0 flex justify-end items-start z-[700] mt-20 mr-1 bg-white"
      data-cy="profileMenu"
    >
      <div className="bg-white border border-grey-100 rounded-lg pl-4 pr-4 dark:bg-gray-800">
        {/* User Details */}
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
          {session.user.roles.map((role: string) => (
            <p key={role} className="mb-2">
              {role.replaceAll("_", " ")}
            </p>
          ))}
        </div>
        {/* Toggle Switch */}
        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <span style={{ marginRight: "8px", fontWeight: "bold" }}>
              Email Reminders
            </span>
            <input
              type="checkbox"
              style={{ display: "none" }}
              checked={isOptedInForEmails}
              onChange={handleOptInChange}
            />
            <span
              style={{
                position: "relative",
                width: "50px",
                height: "24px",
                borderRadius: "50px",
                background: isOptedInForEmails ? "#4ade80" : "#a1a1aa",
                transition: "background-color 0.2s",
              }}
              data-cy="optInToggle"
            >
              <span
                style={{
                  position: "absolute",
                  top: "2px",
                  left: isOptedInForEmails ? "26px" : "2px",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  transition: "left 0.2s",
                  background: "white",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              />
            </span>
            <span style={{ marginLeft: "8px" }}>
              {isOptedInForEmails ? "ON" : "OFF"}
            </span>
          </label>
        </div>
      </div>
    </div>
  ) : (
    <div className="fixed top-0 right-0 h-screen w-1/3 flex justify-end items-start z-50 mt-20 mr-1 z-[700]">
      <div className="bg-white border border-grey-100 rounded-lg pl-4 pr-4">
        <div className="border-b border-black shadow-md mt-4 mb-4">
          <p className="mb-1 font-bold">Not logged in!</p>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
