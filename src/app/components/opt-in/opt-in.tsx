"use client";
import React, { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";

interface EmailOptInModalProps {
  isVisible: boolean;
  onConfirm: (optIn: boolean) => void;
  onClose: () => void;
}

const EmailOptInModal: React.FC<EmailOptInModalProps> = ({
  onConfirm,
  onClose,
}) => {
  const { data: session, status } = useSession();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const modalClosed = sessionStorage.getItem("modalClosed") === "true";
    // Show modal only if there's an active session and it hasn't been closed
    setIsVisible(!!session && !modalClosed && status === "authenticated");
  }, [session, status]);

  const handleClose = () => {
    sessionStorage.setItem("modalClosed", "true"); // Mark the modal as closed in sessionStorage
    setIsVisible(false);
    onClose();
  };

  return (
    <Transition show={isVisible}>
      <Dialog open={isVisible} onClose={onClose} className="relative z-50">
        {/* The overlay */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        {/* The modal container */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-sm rounded bg-white dark:bg-gray-800 p-6">
              <Dialog.Title
                className="text-lg font-medium"
                data-cy="modal-title"
              >
                Confirm Your Email Subscription
              </Dialog.Title>
              <Dialog.Description
                className="mt-2 text-sm text-gray-600 dark:text-gray-200"
                data-cy="modal-description"
              >
                Would you like to receive reminders via email for when your task
                is due? We will send you an email a week before your tasks are
                due and weekly emails when your tasks are overdue.
              </Dialog.Description>

              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => onConfirm(true)}
                  className="rounded px-4 py-2 text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring"
                  data-cy="yes-button"
                >
                  Yes
                </button>
                <button
                  onClick={() => onConfirm(false)}
                  className="rounded px-4 py-2 text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring"
                  data-cy="no-button"
                >
                  No
                </button>
                <button
                  onClick={handleClose}
                  className="rounded px-4 py-2 text-black dark:text-white bg-gray-400 hover:bg-gray-500 focus:outline-none focus:ring"
                  data-cy="close-button"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EmailOptInModal;
