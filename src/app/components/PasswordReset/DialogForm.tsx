"use client";

import { changePasswordAndResetFlag } from "@/app/actions/password";
import { Dialog } from "@headlessui/react";
import { useOptimistic, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";

const containerId = "password-reset-toast-container";

export function DialogForm() {
  // useOptimistic docs: https://react.dev/reference/react/useOptimistic
  const [isLoading, setIsLoading] = useOptimistic<boolean>(false);
  const [isOpen, setIsOpen] = useState(true);

  // We don't want the user to be able to close the dialog - password security
  // is important and a high priority
  const closeDialog = () => {};

  const doPasswordReset = async (f: FormData) => {
    const newPassword = f.get("password")!.toString();

    if (!newPassword) return;

    setIsLoading(true);

    try {
      await changePasswordAndResetFlag(newPassword);
      toast.success("Password successfully changed", { containerId });
      setIsOpen(false);
    } catch (e) {
      toast.error(`Failed to change password`, { containerId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer containerId={containerId} />
      <Dialog
        open={isOpen}
        onClose={closeDialog}
        className="fixed z-50 flex justify-center items-center w-screen h-screen bg-gray-900 bg-opacity-50"
      >
        <Dialog.Panel className="mb-10 z-[51] bg-white dark:bg-slate-700 rounded-lg p-16">
          <form
            data-cy="password-reset-form"
            action={doPasswordReset}
            className="flex flex-col gap-4 items-center"
          >
            <Dialog.Title className="text-center text-2xl pb-8">
              Password Change
            </Dialog.Title>
            <label htmlFor="change-password">Please update your password</label>
            <input
              data-cy="change-password"
              className="w-full rounded p-2 dark:bg-slate-600 disabled:cursor-not-allowed"
              disabled={isLoading}
              id="change-password"
              name="password"
              placeholder="New password..."
              type="password"
            />
            <button
              className="bg-blue-500 disabled:bg-blue-200 disabled:cursor-not-allowed text-white w-fit px-4 py-2 cursor-pointer rounded"
              disabled={isLoading}
              type="submit"
              value="Change"
            >
              {isLoading ? "Changing..." : "Change"}
            </button>
          </form>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
