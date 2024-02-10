import React, { useState, FormEvent, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import { Form, Button, Modal, Toast } from 'react-bootstrap';
import { Role } from '@prisma/client';
import Select from 'react-select';

interface User {
  id: number;
  email: string;
  name: string;
  roles: [];
  password: string;
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
    const [show, setShow] = useState(false); // State for modal visibility

    const [newUser, setNewUser] = useState<User>({
      id: 0,
      email: '',
      name: '',
      password: '',
      // @ts-ignore
      roles: [], 
    });
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setNewUser({
        ...newUser,
        [event.target.name]: event.target.name === 'selectedRoles'
          // @ts-ignore
          ? event.target.value.map((role) => role.value) // Extract role values
          : event.target.value,
      });
    };
    
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
         // @ts-ignore
        const selectedRolesValues = new Set(newUser.roles.map((role) => role.value));
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
          throw new Error(errorData || "Failed to add user");
        }
        toast.success('User added successfully!');
  };


  
    return (
      <>
        <Button variant="success" onClick={handleShow}>
          Create New User
        </Button>
  
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Create User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
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
                  value={newUser.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formRoles">
                <Form.Label>Roles</Form.Label>
                <Select
                  // @ts-ignore
                  options={rolesOptionsForSelect}
                  value={newUser.roles}
                  // @ts-ignore
                  onChange={(selectedRoles) => setNewUser({ ...newUser, roles: selectedRoles })}
                  isMulti
                  className="react-select-container" 
                />
              </Form.Group>
              <Button variant="success" type="submit" style={{marginTop: "1rem"}}>
                Create User
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  };
  
  export default CreateUser;