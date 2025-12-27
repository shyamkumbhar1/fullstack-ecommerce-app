import React, { useState, useEffect, useMemo } from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { usersAPI } from '../../services/api';
import DataTable from '../../components/DataTable';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      try {
        await usersAPI.delete(id);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
      },
      {
        header: 'Email',
        accessorKey: 'email',
      },
      {
        header: 'Phone',
        accessorKey: 'phone',
        cell: ({ row }) => row.original.phone || 'N/A',
      },
      {
        header: 'Role',
        accessorKey: 'role',
        cell: ({ row }) => (
          <Badge bg={row.original.role === 'admin' ? 'danger' : 'primary'}>
            {row.original.role}
          </Badge>
        ),
      },
      {
        header: 'Joined',
        accessorKey: 'createdAt',
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
      },
      {
        header: 'Status',
        accessorKey: 'isActive',
        cell: ({ row }) =>
          row.original.isActive ? (
            <Badge bg="success">Active</Badge>
          ) : (
            <Badge bg="danger">Inactive</Badge>
          ),
      },
      {
        header: 'Actions',
        accessorKey: 'actions',
        cell: ({ row }) => (
          <div>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleDelete(row.original._id, row.original.name)}
              disabled={row.original.role === 'admin'}
              title={row.original.role === 'admin' ? 'Cannot delete admin user' : 'Delete user'}
            >
              Delete
            </Button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    []
  );

  return (
    <>
      <Card className="mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <Card.Title className="mb-0">All Users</Card.Title>
          <Button as={Link} to="/admin/users/add" variant="primary" size="sm">
            Add New User
          </Button>
        </Card.Header>
      </Card>
      <DataTable
        data={users}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search users by name, email..."
        pageSize={10}
      />
    </>
  );
};

export default AdminUsers;

