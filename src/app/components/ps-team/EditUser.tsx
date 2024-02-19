import React, { useState, FormEvent, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import { Form, Button, Modal, Toast } from "react-bootstrap";
import { Role } from "@prisma/client";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";

// Define the structure of a user
interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  roles: [];
}

// Props
interface EditUserProps {
  onClose: () => void; // Prop to close modal form
  userToEdit: User | null; // Added property to receive user data for editing
  show: boolean; // Prop to control modal visibility
  updateUsers: () => void; // Prop to update table after succesful edit of user
  setRefetch: (refetch: number) => void;
  refetch: number;
}

// Create a set of available role options
const rolesOptionsSet = new Set(Object.values(Role));

// Convert the set of role options into an array of objects compatible with react-select
const rolesOptionsForSelect = Array.from(rolesOptionsSet).map((role) => ({
  value: role,
  label: role,
  key: role,
}));

// Define the EditUser component
const EditUser: React.FC<EditUserProps> = ({
  onClose,
  userToEdit,
  show,
  updateUsers,
  setRefetch,
  refetch,
}) => {
  // Set the existing user's details or get blank user details
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

  // Update user details depending on user selected in table
  useEffect(() => {
    // If user to edit exists
    if (userToEdit) {
      // Transform existing roles to the expected format
      const transformedRoles = userToEdit.roles.map((role) => ({
        value: role,
        label: role,
        key: role,
      }));

      // Set the user state with transformed roles
      setUser({
        ...userToEdit,
        // @ts-ignore
        roles: transformedRoles,
      });
    } else {
      // If no user data, set an empty array for roles
      setUser({
        ...user,
        roles: [],
      });
    }
  }, [userToEdit]);

  // Handle change in input fields
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setUser({
      ...user,
      [event.target.name]:
        event.target.name === "selectedRoles"
          ? // @ts-ignore
            event.target.value.map((role) => role.value) // Extract role values
          : event.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Check if roles are empty
    if (user.roles.length === 0) {
      toast.error("Please select at least one role for the user.");
      return; // Prevent form submission
    }

    // @ts-ignore
    // Get the selected user's roles
    const selectedRolesValues = new Set(user.roles.map((role) => role.value));

    // Use the API endpoint for updating users and send the user details
    const response = await fetch("/api/ps-team/edit-users", {
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

    // Alert the user if the api response failed
    if (!response.ok) {
      const errorData = await response.text();
      toast.error(
        "You entered incorrect details or database server failed, please try again",
      );
      throw new Error(errorData || "Failed to edit user");
    }

    // Update the users array to empty as user submitted
    setUser({
      id: 0,
      email: "",
      name: "",
      password: "",
      roles: [],
    });

    // Close the modal after successful user edit
    toast.success("User edited successfully!");
    onClose();

    // Refresh the users table to reflect new details
    updateUsers();
    setRefetch(refetch + 1);
  };

  return (
    <>
      <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                data-cy="email"
                value={user.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                data-cy="name"
                value={user.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                data-cy="password"
                type="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formRoles">
              <Form.Label>Roles</Form.Label>
              <Select
                // @ts-ignore
                options={rolesOptionsForSelect.map((role) => ({
                  ...role,
                  key: role.value,
                }))}
                value={user.roles}
                onChange={(selectedRoles) =>
                  // @ts-ignore
                  setUser({ ...user, roles: selectedRoles })
                }
                isMulti
                className="react-select-container"
              />
            </Form.Group>
            <Button
              data-cy="EditUser"
              variant="success"
              type="submit"
              style={{ marginTop: "1rem" }}
            >
              Edit User
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditUser;
