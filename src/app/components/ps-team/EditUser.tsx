import React, { useState, FormEvent, useEffect } from "react";
import { toast } from "react-toastify";
import { Role } from "@prisma/client";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";

interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  roles: { value: string }[] | { value: string; label: string }[];
}

interface EditUserProps {
  onClose: () => void;
  userToEdit: User | null;
  show: boolean;
  updateUsers: () => void;
  setRefetch: (refetch: number) => void;
  refetch: number;
}

const rolesOptionsSet = new Set(Object.values(Role));

const rolesOptionsForSelect = Array.from(rolesOptionsSet).map((role) => ({
  value: role,
  label: role,
}));

const EditUser: React.FC<EditUserProps> = ({
  onClose,
  userToEdit,
  show,
  updateUsers,
  setRefetch,
  refetch,
}) => {
  const [user, setUser] = useState<User>(
    userToEdit
      ? userToEdit
      : {
          id: 0,
          email: "",
          name: "",
          password: "",
          roles: [],
        },
  );

  useEffect(() => {
    if (userToEdit) {
      const transformedRoles = userToEdit.roles.map((role) => ({
        value: role.toString(),
        label: role.toString(),
      }));
      // Set password to blank when editing user
      setUser({
        ...userToEdit,
        roles: transformedRoles,
        password: "",
      });
    } else {
      setUser({
        ...user,
        roles: [],
      });
    }
  }, [userToEdit]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setUser({
      ...user,
      [event.target.name]:
        event.target.name === "selectedRoles"
          ? event.target.value
          : (event.target.value as unknown as string[]),
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (user.roles.length === 0) {
      toast.error("Please select at least one role for the user.");
      return;
    }

    const selectedRolesValues = new Set(
      user.roles.map((role) => role["value"]),
    );

    const response = await fetch("/api/ps-team/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        roles: Array.from(selectedRolesValues),
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      toast.error(
        "You entered incorrect details or database server failed, please try again",
      );
      throw new Error(errorData || "Failed to edit user");
    }

    setUser({
      id: 0,
      email: "",
      name: "",
      password: "",
      roles: [],
    });

    toast.success("User edited successfully!");
    onClose();
    updateUsers();
    setRefetch(refetch + 1);
  };

  return (
    <>
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
                  <h2 className="text-xl font-bold text-black">Edit User</h2>
                  <button
                    type="button"
                    onClick={onClose}
                    className="bg-red-700 hover:bg-azure-700 text-white font-bold py-2 px-4 rounded"
                    data-cy="ClosePopUp"
                  >
                    X
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
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
                      value={user.email}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                      required
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
                      value={user.name}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                      required
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
                      value={user.password}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="roles"
                      className="block text-sm font-bold mb-2 text-black"
                    >
                      Roles
                    </label>
                    <Select
                      options={rolesOptionsForSelect.map((role) => ({
                        ...role,
                        key: role.value,
                      }))}
                      value={user.roles}
                      onChange={(selectedRoles) => {
                        const newRoles = selectedRoles.map((option) => ({
                          value: option.value,
                          label: option.value,
                        }));
                        setUser({ ...user, roles: newRoles });
                      }}
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
                    data-cy="EditUser"
                    style={{
                      marginTop: "1rem",
                      height: "5rem",
                      width: "29rem",
                      fontSize: "larger",
                    }}
                  >
                    Edit User
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

export default EditUser;
