import React, { useState, FormEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import { Form, Button, Modal } from "react-bootstrap";
import { Role } from "@prisma/client";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";

// Define the structure of a user
interface User {
  id: number;
  email: string;
  name: string;
  roles: [];
  password: string;
}

// Define the properties for CreateUser component
interface CreateUserProps {
  onClose: () => void;
}

// Create a set of available role options
const rolesOptionsSet = new Set(Object.values(Role));

// Convert the set of role options into an array of objects compatible with react-select
const rolesOptionsForSelect = Array.from(rolesOptionsSet).map((role) => ({
  value: role,
  label: role,
}));

// Define the CreateUser component
const CreateUser: React.FC<CreateUserProps> = ({ onClose }) => {
  const [show, setShow] = useState(false); // State for modal visibility

  const [newUser, setNewUser] = useState<User>({
    id: 0,
    email: "",
    name: "",
    password: "",
    roles: [],
  });

  // Handle closing and showing the pop-up modal form
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Handle changes in input fields
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setNewUser({
      ...newUser,
      [event.target.name]:
        event.target.name === "selectedRoles"
          ? // @ts-ignore
            event.target.value.map((role: { value: any }) => role.value) // Extract role values
          : event.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Check if roles are empty
    if (newUser.roles.length === 0) {
      toast.error("Please select at least one role for the user");
      return; // Prevent form submission
    }

    // Get the selected roles of the user from the drop-down multi-selector
    const selectedRolesValues = new Set(
      newUser.roles.map((role) => role["value"]),
    );

    // Create the user using the api endpoint
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

    // Alert the user if the api response failed
    if (!response.ok) {
      const errorData = await response.text();
      toast.error(
        "User either already exists or incorrect details entered or database server failed, please try again",
      );
      throw new Error(errorData || "Failed to add user");
    }

    // Update the users array to re-render the table with the new user
    setNewUser({
      id: 0,
      email: "",
      name: "",
      password: "",
      roles: [],
    });

    // Close the modal after successful user creation
    setShow(false);
    toast.success("User added successfully!");
    window.location.reload();
  };

  return (
    <>
      <Button
        onClick={handleShow}
        variant="dark"
        style={{
          marginTop: "1rem",
          height: "5rem",
          width: "20rem",
          fontSize: "larger",
        }}
      >
        Create User
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit} style={{ justifyContent: "center" }}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                data-cy="email"
                value={newUser.email}
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
                value={newUser.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                data-cy="password"
                value={newUser.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formRoles">
              <Form.Label>Roles</Form.Label>
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
                className="react-select-container"
              />
            </Form.Group>
            <Button
              data-cy="CreateUser"
              variant="dark"
              type="submit"
              style={{
                marginTop: "1rem",
                height: "5rem",
                width: "29rem",
                fontSize: "larger",
              }}
            >
              Create New User
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreateUser;
