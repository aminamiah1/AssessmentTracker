import React, { useState, useEffect } from "react";
import { useTable } from "react-table";
import axios from "axios";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditUser from "./EditUser";
import { Form, FormControl, FormLabel, Button } from "react-bootstrap";

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
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]); // New state for filtered view

  useEffect(() => {
    const fetchUsers = async () => {
      // Fetch users only when component mounts or search is cleared
      if (!search) {
        const response = await axios.get("/api/ps-team/get-users");
        const sortedUsers = response.data.sort((a: any, b: any) => a.id - b.id);
        setUsers(sortedUsers);
        setFilteredUsers(sortedUsers); // Initialize filtered view with all users
      }
    };

    fetchUsers();
  }, [search, users]); // Run effect when search or user array changes

  const handleSearch = (event: any) => {
    setSearch(event.target.value);
    setFilteredUsers(
      users.filter((user) => {
        const searchTerm = event.target.value.toLowerCase();
        return (
          //Can search by role or name to find users in the table
          user.name.toLowerCase().includes(searchTerm) ||
          user.roles.some((role: string) =>
            role.toLowerCase().includes(searchTerm),
          )
        );
      }),
    );
  };

  const handleEdit = async (user: any) => {
    setSearch(""); // Reset search to show all users

    var id = user.id;
    fetch(`/api/ps-team/get-user?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          // Parse the JSON response and pass user details
          return response.json();
        } else {
          // Handle errors with toast message to inform user
          toast.error("Error getting user");
          throw new Error("Error getting user");
        }
      })
      .then((data) => {
        // Set userToEdit state with received data
        setUserToEdit(data);
        // Show the edit user modal
        setShowEditUserModal(true);
      })
      .catch((error) => {
        // Handle network errors with toast to inform user
        toast.error("Network error please try again");
      });
  };

  const handleDelete = async (user: any) => {
    try {
      setSearch(""); // Reset search to show all users

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
            // Handle successful deletion and update users array to re-set table
            setUsers(users.filter((u) => u.id !== id));
          } else {
            // Handle errors with toast message to inform user
            toast.error("'Error deleting user");
          }
        })
        .catch((error) => {
          // Handle network errors with toast to inform user
          toast.error("Network error please try again");
        });

      // Success message with toast to add
      toast.success("Delete user successful!");
    } catch (error) {
      // Display an error message to the user with toast message
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
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Roles",
        accessor: (user: User) => user.roles.join(", "),
      },
      {
        Header: "Delete",
        accessor: (id: any) => (
          <Button variant="danger" onClick={() => handleDelete(id)}>
            Delete
          </Button>
        ),
      },
      {
        Header: "Edit",
        accessor: (id: any) => (
          <Button variant="success" onClick={() => handleEdit(id)}>
            Edit
          </Button>
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
      <Form className="d-flex align-items-center mb-3">
        <FormControl
          id="search"
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Enter name or user role..."
        />
      </Form>
      <EditUser
        show={showEditUserModal}
        onClose={() => setShowEditUserModal(false)}
        userToEdit={userToEdit}
        updateUsers={handleUpdateUsers}
      />
      <Table bordered hover responsive variant="light" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, headerGroupIndex) => (
            // @ts-ignore
            <tr
              key={`header-group-${headerGroupIndex}`}
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column, columnIndex) => (
                // @ts-ignore
                <th
                  key={`header-${headerGroupIndex}-${columnIndex}`}
                  {...column.getHeaderProps()}
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
              <tr key={`row-${rowIndex}`} {...row.getRowProps()}>
                {row.cells.map((cell, cellIndex) => (
                  // @ts-ignore
                  <td
                    key={`cell-${rowIndex}-${cellIndex}`}
                    {...cell.getCellProps()}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

export default UsersTable;
