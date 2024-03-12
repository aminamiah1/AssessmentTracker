import React, { useEffect, useState } from "react";
import { FaEdit, FaToggleOff } from "react-icons/fa"; // Trash can icon
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
}

const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [search, setSearch] = React.useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [refetch, setRefetch] = useState(0);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!search) {
        try {
          const response = await fetch("/api/ps-team/users/get");
          const data = await response.json();
          const sortedUsers = data.sort((a: User, b: User) => a.id - b.id);
          setUsers(sortedUsers);
          setFilteredUsers(sortedUsers);
        } catch (e) {
          setUsers([]);
          setFilteredUsers([]);
        }
      }
    };

    fetchUsers();
  }, [search, refetch]);

  const handleSearch = (event: any) => {
    setSearch(event.target.value);
    setFilteredUsers(
      users.filter((user) => {
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

      toast.success("De-activating user successful!");
      setShowDeactivateModal(false);
      setRefetch(refetch + 1);
    } catch (error) {
      toast.error("Error deleting user");
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
      {
        Header: "De-Activate",
        accessor: (id: User) => (
          <button
            onClick={() => {
              setUserToDeactivate(id);
              setShowDeactivateModal(true);
            }}
            data-cy="DeactivateUser"
          >
            <FaToggleOff className="cursor-pointer" size={30} />
          </button>
        ),
      },
      {
        Header: "Edit",
        accessor: (id: User) => (
          <button onClick={() => handleEdit(id)} data-cy="EditUserTable">
            <FaEdit className="cursor-pointer" size={30} />
          </button>
        ),
      },
    ],
    [],
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
                data-cy="DeactivateUserConfirm"
                onClick={() => handleDeactivate(userToDeactivate)}
              >
                De-activate
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UsersTable;
