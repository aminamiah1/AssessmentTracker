"use client";
import React, { useState, FormEvent } from "react";
import { toast } from "react-toastify";
import Select from "react-select";
import { Role } from "@prisma/client";

interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  roles: [];
}

interface CreateUserProps {
  onClose: () => void;
}

const rolesOptionsSet = new Set(Object.values(Role));

const rolesOptionsForSelect = Array.from(rolesOptionsSet).map((role) => ({
  value: role,
  label: role,
}));

const CreateUser: React.FC<CreateUserProps> = ({ onClose }) => {
  const [show, setShow] = useState(true);
  const [newUser, setNewUser] = useState<User>({
    id: 0,
    email: "",
    name: "",
    password: "",
    roles: [],
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setNewUser({
      ...newUser,
      [event.target.name]:
        event.target.name === "selectedRoles"
          ? // @ts-ignore
            event.target.value.map((role: { value: any }) => role.value)
          : event.target.value,
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newUser.roles.length === 0) {
      toast.error("Please select at least one role for the user");
      return;
    }

    const selectedRolesValues = new Set(
      newUser.roles.map((role) => role["value"]),
    );

    const response = await fetch("/api/ps-team/create-users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        roles: Array.from(selectedRolesValues),
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      toast.error(
        "User either already exists or incorrect details entered or database server failed, please try again",
      );
      throw new Error(errorData || "Failed to add user");
    }

    setNewUser({
      id: 0,
      email: "",
      name: "",
      password: "",
      roles: [],
    });

    setShow(false);
    toast.success("User added successfully!");
    window.location.reload();
  };

  return (
    <>
      <button
        onClick={handleShow}
        className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
        style={{
          marginTop: "1rem",
          height: "5rem",
          width: "20rem",
          fontSize: "larger",
        }}
      >
        Create New User
      </button>

      {show && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-black">
                    Create New User
                  </h2>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="bg-red-700 hover:bg-azure-700 text-white font-bold py-2 px-4 rounded"
                  >
                    X
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="justify-center">
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-bold mb-2 text-black"
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      data-cy="email"
                      value={newUser.email}
                      onChange={handleChange}
                      required
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="block text-sm font-bold mb-2 text-black"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      data-cy="name"
                      value={newUser.name}
                      onChange={handleChange}
                      required
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline text-black"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="block text-sm font-bold mb-2 text-black"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      data-cy="password"
                      value={newUser.password}
                      onChange={handleChange}
                      required
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="roles"
                      className="block text-sm text-black font-bold mb-2"
                    >
                      Roles
                    </label>
                    <Select
                      data-cy="roles"
                      id="roles"
                      // @ts-ignore
                      options={rolesOptionsForSelect.map((role) => ({
                        ...role,
                        key: role.value,
                      }))}
                      value={newUser.roles}
                      onChange={(selectedRoles) =>
                        // @ts-ignore
                        setNewUser({ ...newUser, roles: selectedRoles })
                      }
                      isMulti
                      className="react-select-container text-black"
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                          color: "black",
                        }),
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gray-700 hover:bg-azure-700 text-white font-bold py-2 px-4 rounded"
                    style={{
                      marginTop: "1rem",
                      height: "5rem",
                      width: "29rem",
                      fontSize: "larger",
                    }}
                  >
                    Create New User
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateUser;
