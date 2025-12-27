import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { productsAPI } from '../../services/api';
import DataTable from '../../components/DataTable';
import { BACKEND_URL } from '../../utils/constants';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(id);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        header: 'Image',
        accessorKey: 'image',
        cell: ({ row }) => (
          <img
            src={row.original.image ? `${BACKEND_URL}${row.original.image}` : 'https://via.placeholder.com/50'}
            alt={row.original.name}
            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
          />
        ),
        enableSorting: false,
      },
      {
        header: 'Name',
        accessorKey: 'name',
      },
      {
        header: 'Price',
        accessorKey: 'price',
        cell: ({ row }) => `₹${row.original.price}`,
      },
      {
        header: 'Stock',
        accessorKey: 'stock',
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
              as={Link}
              to={`/admin/products/edit/${row.original._id}`}
              variant="outline-primary"
              size="sm"
              className="me-2"
            >
              Edit
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleDelete(row.original._id)}
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
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <Card.Title className="mb-0">Products</Card.Title>
            <Button as={Link} to="/admin/products/add" variant="primary">
              Add Product
            </Button>
          </div>
        </Card.Header>
      </Card>
      <DataTable
        data={products}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search products by name..."
        pageSize={10}
      />
    </>
  );
};

export default AdminProducts;

