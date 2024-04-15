"use client";
import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import EmailOptInModal from "../components/opt-in/opt-in";
import { TaskList } from "../components/TaskList/TaskList";

export default function Page() {
  const { data: session, status } = useSession();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
    if (status === "authenticated") {
      const hasResponded = localStorage.getItem(
        `user_${session.user.id}_opted_in_responded`,
      );
      if (!hasResponded) {
        setShowModal(true);
      }
    }
  }, [status, session]);

  const handleOptInConfirmation = async (optIn: boolean) => {
    setShowModal(false);
    localStorage.setItem(`user_${session?.user.id}_opted_in_responded`, "true");
    await fetch("/api/opt-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: session?.user.id,
        optIn: optIn,
      }),
    });
    // Display toast notification
    toast.success("You have been sent a confirmation email.", {
      position: "top-center",
    });
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="text-center">
        <h1 className={`text-3xl text-black dark:text-white`}>Task List</h1>
      </div>
      {showModal && (
        <EmailOptInModal
          isVisible={showModal}
          onConfirm={handleOptInConfirmation}
          onClose={() => setShowModal(false)}
        />
      )}
      {session && (
        <TaskList
          userId={+session.user.id}
          itemTemplateName={"ProgressListItem"}
        />
      )}
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
