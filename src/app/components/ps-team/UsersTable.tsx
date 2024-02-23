import React, { useState, useEffect } from "react";
import { useTable } from "react-table";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import EditUser from "./EditUser";
import searchImg from "./assets/search.png";
import editImg from "./assets/editIcon.png";
import trashCan from "./assets/trashCan.png";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!search) {
        const response = await axios.get("/api/ps-team/get-users");
        const sortedUsers = response.data.sort((a: any, b: any) => a.id - b.id);
        setUsers(sortedUsers);
        setFilteredUsers(sortedUsers);
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

  const handleEdit = async (user: any) => {
    setSearch("");

    var id = user.id;
    fetch(`/api/ps-team/get-user?id=${id}`, {
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

  const handleDelete = async (user: any) => {
    try {
      setSearch(" ");

      var id = user.id;

      fetch(`/api/ps-team/delete-users?id=${id}`, {
        method: "DELETE",
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
            toast.error("'Error deleting user");
          }
        })
        .catch((error) => {
          toast.error("Network error please try again");
        });

      toast.success("Delete user successful!");
      setShowDeleteModal(false);
      setRefetch(refetch + 1);
    } catch (error) {
      toast.error("Error deleting user");
    }
  };

  const handleUpdateUsers = () => {
    const filteredUsers = users.sort((a: any, b: any) => a.id - b.id);
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
        Header: "Delete",
        accessor: (id: any) => (
          <button
            onClick={() => {
              setUserToDelete(id);
              setShowDeleteModal(true);
            }}
          >
            <Image
              src={trashCan}
              alt="trash can delete"
              width={48}
              height={48}
            />
          </button>
        ),
      },
      {
        Header: "Edit",
        accessor: (id: any) => (
          <button onClick={() => handleEdit(id)} data-cy="EditUser">
            <Image src={editImg} alt="edit user icon" width={48} height={48} />
          </button>
        ),
      },
    ],
    [],
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      // @ts-ignore
      columns,
      data: filteredUsers,
    });

  return (
    <>
      <div className="flex items-center mb-3">
        <Image
          alt="search"
          src={searchImg}
          width={32}
          height={32}
          className="mr-2"
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
                // @ts-ignore
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
          showDeleteModal ? "block" : "hidden"
        }`}
      >
        {userToDelete && (
          <div className="bg-white p-5 border rounded-lg">
            <p>Delete user: {userToDelete.name}?</p>
            <p className="text-black">
              Are you sure you want to delete user: {userToDelete.name}?
            </p>
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-700 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-gray-700 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleDelete(userToDelete)}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UsersTable;
