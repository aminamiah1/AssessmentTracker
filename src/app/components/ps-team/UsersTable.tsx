import React, { useState, useEffect } from "react";
import { useTable } from "react-table";
import Image from "next/image"; // Importing Image component from Next.js
import axios from "axios";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditUser from "./EditUser";
import searchImg from "./assets/search.png";
import editImg from "./assets/editIcon.png";
import trashCan from "./assets/trashCan.png";
import { Form, FormControl, FormLabel, Button, Modal } from "react-bootstrap";

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
  const [refetch, setRefetch] = useState(0);
  // State variable for managing the visibility of the delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

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
  }, [search, refetch]); // Run effect when search changes

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
      setSearch(" "); // Reset search to show all users

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
            setSearch(""); //Reset search
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
      setShowDeleteModal(false);
      setRefetch(refetch + 1); //Refetch all user details
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
              ); // Capitalize first letter for other roles
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
            }} // Show modal after successful fetch
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Image
              className="object-cover"
              src={trashCan}
              alt="trash can delete"
              style={{ height: "3rem", width: "3rem" }}
            />
          </button>
        ),
      },
      {
        Header: "Edit",
        accessor: (id: any) => (
          <button onClick={() => handleEdit(id)}>
            <Image
              className="object-cover"
              src={editImg}
              alt="edit user icon"
              style={{ height: "3rem", width: "3rem" }}
            />
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
      <Form className="d-flex align-items-center mb-3">
        <Image
          alt="search"
          className="object-cover"
          src={searchImg}
          style={{
            width: "2rem",
            paddingBottom: "1rem",
            marginLeft: "1rem",
            marginRight: "1rem",
          }}
        />
        <FormControl
          id="search"
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Enter name or user role..."
          style={{
            marginBottom: "2rem",
            padding: "1rem",
            boxShadow: "5px 5px black, 15px 15px 15px 15px #2b355400",
          }}
        />
      </Form>
      <EditUser
        show={showEditUserModal}
        onClose={() => setShowEditUserModal(false)}
        userToEdit={userToEdit}
        updateUsers={handleUpdateUsers}
        setRefetch={setRefetch}
        refetch={refetch}
      />
      <Table
        bordered
        hover
        responsive
        variant="light"
        {...getTableProps()}
        style={{
          fontSize: "larger",
          backgroundColor: "white",
          border: "20px black",
          boxShadow: "5px 5px black, 15px 15px 15px 15px #2b355400",
        }}
      >
        <thead>
          {headerGroups.map((headerGroup, headerGroupIndex) => (
            <tr
              // @ts-ignore
              key={`header-group-${headerGroupIndex}`}
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column, columnIndex) => (
                <th
                  // @ts-ignore
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
                  <td
                    // @ts-ignore
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

      {/* Modal for confirming user deletion */}
      <Modal
        show={showDeleteModal && userToDelete !== null}
        onHide={() => setShowDeleteModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {userToDelete ? (
              <p>Delete user: {userToDelete.name}?</p>
            ) : (
              <p>Delete user</p>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userToDelete ? (
            <p>Are you sure you want to delete user: {userToDelete.name}?</p>
          ) : (
            <p>Are you sure you want to delete the selected user?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          {/* Button to cancel deletion */}
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          {/* Button to confirm deletion */}
          <Button variant="danger" onClick={() => handleDelete(userToDelete)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UsersTable;
