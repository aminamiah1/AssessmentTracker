import React, { useState, useEffect } from 'react';
import { useTable} from 'react-table';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';

interface User {
  id: number;
  email: string;
  name: string;
  roles: [];
}

const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
     const fetchUsers = async () => {
     const response = await axios.get('/api/ps-team/get-users');
     // Filter users by lowest ID first
     const filteredUsers = response.data.sort((a: any, b: any) => a.id - b.id);
     setUsers(filteredUsers);
    };
    fetchUsers();
  }, users);

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Roles',
        accessor: (user: User) => user.roles.join(', '),
      },
      {
        Header: 'Delete',
        accessor: (id: any) => (
          <Button variant="danger" onClick={() => handleDelete(id)}>
            Delete
          </Button>
        ),
      },
      {
        Header: 'Edit',
        accessor: (id: any) => (
          <Button variant="success" onClick={() => handleEdit(id)}>
            Edit
          </Button>
        ),
      },
    ],
    []
  );
  
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    // @ts-ignore
    columns,
    data: users
  });

  
  const handleEdit = async (user: any) => {
    var id = user.id;
    //To Do
  };

  const handleDelete = async (user: any) => {
    try {

      var id = user.id;

      fetch(`/api/ps-team/delete-users?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ id: id })
      })
        .then(response => {
          if (response.ok) {
            // Handle successful deletion and update users array to re-set table
            setUsers(users.filter((u) => u.id !== id));
          } else {
            // Handle errors with toast message to inform user
            toast.error("'Error deleting user");
          }
        })
        .catch(error => {
          // Handle network errors with toast to inform user
          toast.error("Network error");
      });

      // Success message with toast to add
      toast.success('Delete user successful!');
      
    } catch (error) {
      // Display an error message to the user with toast message
      toast.error("Error deleting user");
    } 
  };

  return (
    <Table bordered hover responsive variant="light" {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default UsersTable;