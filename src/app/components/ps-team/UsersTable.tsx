import React, { useState, useEffect } from 'react';
import { useTable} from 'react-table';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
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
  }, []);

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
        Header: 'Role',
        accessor: 'role',
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
          <Button variant="success" onClick={() => handleDelete(id)}>
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
            // Handle successful deletion
            console.log('User deleted successfully');
            setUsers(users.filter((u) => u.id !== id));
          } else {
            // Handle errors with toast message to add
            console.error('Error deleting user:', response.statusText);
          }
        })
        .catch(error => {
          // Handle network errors with toast to add
          console.error('Network error:', error);
      });

      // Success message with toast to add
      
    } catch (error) {
      // Display an error message to the user to do with toast message
      console.log("error" + error)
    } 
  };

  return (
    <Table striped bordered hover responsive variant="dark" {...getTableProps()}>
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