import React, { useEffect, useState } from "react";
import { FaEdit, FaToggleOff, FaTrash } from "react-icons/fa"; // Trash can icon
import { FiSearch } from "react-icons/fi"; // Search icon
import { useTable } from "react-table";
import { toast } from "react-toastify";
import EditUser from "./EditUser";

interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  roles: [];
  status: string;
}

const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [search, setSearch] = React.useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [refetch, setRefetch] = useState(0);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);
  const [userToActivate, setUserToActivate] = useState<User | null>(null);
  const [isInActiveFilter, setIsActiveFilter] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!search) {
        try {
          const response = await fetch("/api/ps-team/users/get");
          const data = await response.json();
          const users = data.sort((a: User, b: User) => a.id - b.id);

          // Filter users if inactive else show all users
          // Apply both search and status filtering
          const filteredUsers = users.filter((user: User) => {
            if (!search) {
              return user.status === (isInActiveFilter ? "active" : "inactive");
            }

            const searchTerm = search.toLowerCase();

            return (
              user.name.toLowerCase().includes(searchTerm) ||
              user.roles.some((role: string) =>
                role.toLowerCase().includes(searchTerm),
              )
            );
          });

          setFilteredUsers(filteredUsers);
        } catch (e) {
          setUsers([]);
          setFilteredUsers([]);
        }
      }
    };

    fetchUsers();
  }, [isInActiveFilter, search, refetch]);

  const handleSearch = (event: any) => {
    setSearch(event.target.value);
    setFilteredUsers(
      filteredUsers.filter((user) => {
        const searchTerm = event.target.value.toLowerCase();
        return (
          user.name.toLowerCase().includes(searchTerm) ||
          user.roles.some((role: string) =>
            role.toLowerCase().includes(searchTerm),
          )
        );
      }),
    );
  };

  const handleEdit = async (user: User) => {
    setSearch("");

    var id = user.id;
    fetch(`/api/ps-team/user/get?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          toast.error("Error getting user");
          throw new Error("Error getting user");
        }
      })
      .then((data) => {
        setUserToEdit(data);
        setShowEditUserModal(true);
      })
      .catch((error) => {
        toast.error("Network error please try again");
      });
  };

  const handleDeactivate = async (user: User) => {
    try {
      setSearch(" ");

      var id = user.id;

      fetch(`/api/ps-team/user/deactivate?id=${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      })
        .then((response) => {
          if (response.ok) {
            setSearch("");
            setUsers(users.filter((u) => u.id !== id));
          } else {
            toast.error("'Error de-activating user");
          }
        })
        .catch((error) => {
          toast.error("Network error please try again");
        });

      toast.success("Deactivated user successfully!");
      setShowDeactivateModal(false);
      setRefetch(refetch + 1);
    } catch (error) {
      toast.error("Error de-activating user");
    }
  };

  const handleActivate = async (user: User) => {
    try {
      setSearch(" ");

      var id = user.id;

      fetch(`/api/ps-team/user/activate?id=${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      })
        .then((response) => {
          if (response.ok) {
            setSearch("");
            setUsers(users.filter((u) => u.id !== id));
          } else {
            toast.error("Error activating user");
          }
        })
        .catch((error) => {
          toast.error("Network error please try again");
        });

      toast.success("Activated user successfully!");
      setShowActivateModal(false);
      setRefetch(refetch + 1);
    } catch (error) {
      toast.error("Error activating user");
    }
  };

  const handleUpdateUsers = () => {
    const filteredUsers = users.sort((a: User, b: User) => a.id - b.id);
    setUsers(filteredUsers);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Roles",
        accessor: (user: User) => {
          const capitalizedRoles = user.roles.map((role: string) => {
            if (role.toLowerCase() === "module_leader") {
              return "Module Leader";
            } else if (role.toLowerCase() === "ps_team") {
              return "PS Team";
            } else if (role.toLowerCase() === "internal_moderator") {
              return "Internal Moderator";
            } else if (role.toLowerCase() === "external_examiner") {
              return "External Examiner";
            } else if (role.toLowerCase() === "panel_member") {
              return "Panel Member";
            } else if (role.toLowerCase() === "system_admin") {
              return "System Admin";
            } else {
              return (
                role.replace("_", " ").charAt(0).toUpperCase() + role.slice(1)
              );
            }
          });
          return capitalizedRoles.join(" ● ");
        },
      },
      ...(isInActiveFilter
        ? [
            {
              Header: "De-Activate",
              accessor: (id: User) => (
                <button
                  onClick={() => {
                    setUserToDeactivate(id);
                    setShowDeactivateModal(true);
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                  data-cy="deactivateButton"
                >
                  <FaToggleOff className="cursor-pointer" size={30} />
                </button>
              ),
            },
          ]
        : [
            {
              Header: "Re-Activate",
              accessor: (id: User) => (
                <button
                  onClick={() => {
                    setUserToActivate(id);
                    setShowActivateModal(true);
                  }}
                  data-cy="activateButton"
                  className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                  <FaToggleOff className="cursor-pointer" size={30} />
                </button>
              ),
            },
          ]),
      {
        Header: "Edit",
        accessor: (id: User) => (
          <button onClick={() => handleEdit(id)} data-cy="EditUserTable">
            <FaEdit className="cursor-pointer" size={30} />
          </button>
        ),
      },
    ],
    [isInActiveFilter],
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      // The columns defined in the table is not a commonly defined type hence the ts ignore comment
      // @ts-ignore
      columns,
      data: filteredUsers,
    });

  return (
    <>
      <div className="flex justify-center items-center mb-3">
        <h1 className="text-xl">
          Currently Viewing {isInActiveFilter ? "Active" : "Inactive"} Users
        </h1>
      </div>
      <div className="flex items-center mb-3 overflow-y-auto">
        <FiSearch
          className="mr-2 mb-2 text-black"
          size={30}
          style={{ marginRight: "1rem", height: "2rem", width: "fit" }}
        />
        <input
          id="search"
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Enter name or user role..."
          className="p-2 mb-3 shadow-md border-b-4 border-black w-full text-black"
        />
        <button
          onClick={() => setIsActiveFilter(!isInActiveFilter)}
          className={
            isInActiveFilter !== null
              ? "bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded ml-2 flex"
              : ""
          }
          data-cy="toggleStatusViewButton"
        >
          <FaToggleOff className="mr-2 mb-2 text-black" size={30} />
          {isInActiveFilter === null
            ? "All Users"
            : isInActiveFilter
              ? "Inactive Users"
              : "Active Users"}
        </button>
      </div>
      <EditUser
        show={showEditUserModal}
        onClose={() => setShowEditUserModal(false)}
        userToEdit={userToEdit}
        updateUsers={handleUpdateUsers}
        setRefetch={setRefetch}
        refetch={refetch}
      />
      <table
        className="table-auto w-full bg-gray-100 border border-black shadow-md text-black shadow-md border-b-4 border-black mb-3 text-lg"
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup, headerGroupIndex) => (
            <tr key={`header-group-${headerGroupIndex}`}>
              {headerGroup.headers.map((column, columnIndex) => (
                <th
                  key={`header-${headerGroupIndex}-${columnIndex}`}
                  className="border border-black"
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, rowIndex) => {
            prepareRow(row);
            return (
              // @ts-ignore
              <tr
                // @ts-ignore placed here as key required but typescript states key is already defined
                key={`row-${rowIndex}`}
                {...row.getRowProps()}
                className="border border-black"
              >
                {row.cells.map((cell, cellIndex) => (
                  <td
                    key={`cell-${rowIndex}-${cellIndex}`}
                    className="border border-black pl-2"
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
          showDeactivateModal ? "block" : "hidden"
        }`}
      >
        {userToDeactivate && (
          <div className="bg-white p-5 border border-black rounded-lg">
            <p className="text-black">
              Are you sure you want to de-activate user: {userToDeactivate.name}
              ?
            </p>
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-700 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowDeactivateModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-gray-700 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                data-cy="deactivateConfirmButton"
                onClick={() => handleDeactivate(userToDeactivate)}
              >
                De-activate
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
          showActivateModal ? "block" : "hidden"
        }`}
      >
        {userToActivate && (
          <div className="bg-white p-5 border border-black rounded-lg">
            <p className="text-black">
              Are you sure you want to activate user: {userToActivate.name}?
            </p>
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-700 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowActivateModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-gray-700 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                data-cy="activateConfirmButton"
                onClick={() => handleActivate(userToActivate)}
              >
                Activate
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UsersTable;
