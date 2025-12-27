import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Form, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { ordersAPI } from '../../services/api';
import { paymentAPI } from '../../services/paymentAPI';
import DataTable from '../../components/DataTable';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getAll();
      setOrders(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleSyncOrder = async (razorpayOrderId, orderId) => {
    if (!razorpayOrderId) {
      toast.error('Razorpay Order ID not found');
      return;
    }

    setSyncing(prev => ({ ...prev, [orderId]: true }));
    try {
      const response = await paymentAPI.syncOrder(razorpayOrderId);
      toast.success('Order synced successfully from Razorpay');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to sync order');
    } finally {
      setSyncing(prev => ({ ...prev, [orderId]: false }));
    }
  };

  // Helper function to get payment status badge color
  const getPaymentStatusBadge = (status) => {
    const statusMap = {
      'completed': 'success',
      'pending': 'warning',
      'failed': 'danger',
      'refunded': 'info'
    };
    return statusMap[status] || 'secondary';
  };

  // Helper function to get payment method badge
  const getPaymentMethodBadge = (method) => {
    return method === 'RAZORPAY' ? 'primary' : 'secondary';
  };

  const columns = useMemo(
    () => [
      {
        header: 'Order ID',
        accessorKey: '_id',
        cell: ({ row }) => `#${row.original._id.slice(-6)}`,
      },
      {
        header: 'Customer',
        accessorKey: 'user.name',
        cell: ({ row }) => row.original.user?.name || 'N/A',
      },
      {
        header: 'Items',
        accessorKey: 'items',
        cell: ({ row }) => `${row.original.items.length} item(s)`,
        enableSorting: false,
      },
      {
        header: 'Total',
        accessorKey: 'totalPrice',
        cell: ({ row }) => `₹${row.original.totalPrice}`,
      },
      {
        header: 'Payment Method',
        accessorKey: 'paymentMethod',
        cell: ({ row }) => (
          <Badge bg={getPaymentMethodBadge(row.original.paymentMethod)}>
            {row.original.paymentMethod === 'RAZORPAY' ? 'Online' : 'COD'}
          </Badge>
        ),
      },
      {
        header: 'Razorpay Order ID',
        accessorKey: 'razorpayOrderId',
        cell: ({ row }) =>
          row.original.razorpayOrderId ? (
            <small className="text-muted" style={{ fontSize: '0.75rem' }}>
              {row.original.razorpayOrderId}
            </small>
          ) : (
            <span className="text-muted">-</span>
          ),
        enableSorting: false,
      },
      {
        header: 'Payment Status',
        accessorKey: 'paymentStatus',
        cell: ({ row }) => (
          <Badge bg={getPaymentStatusBadge(row.original.paymentStatus)}>
            {row.original.paymentStatus || 'pending'}
          </Badge>
        ),
      },
      {
        header: 'Paid',
        accessorKey: 'isPaid',
        cell: ({ row }) =>
          row.original.isPaid ? (
            <Badge bg="success">Yes</Badge>
          ) : (
            <Badge bg="warning">No</Badge>
          ),
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => {
          const statusColors = {
            pending: 'warning',
            processing: 'info',
            shipped: 'primary',
            delivered: 'success',
          };
          return (
            <Badge bg={statusColors[row.original.status] || 'secondary'}>
              {row.original.status}
            </Badge>
          );
        },
      },
      {
        header: 'Date',
        accessorKey: 'createdAt',
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
      },
      {
        header: 'Actions',
        accessorKey: 'actions',
        cell: ({ row }) => (
          <div className="d-flex gap-2 align-items-center">
            <Form.Select
              size="sm"
              value={row.original.status}
              onChange={(e) => handleStatusUpdate(row.original._id, e.target.value)}
              style={{ width: '120px' }}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </Form.Select>
            {row.original.paymentMethod === 'RAZORPAY' && row.original.razorpayOrderId && (
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => handleSyncOrder(row.original.razorpayOrderId, row.original._id)}
                disabled={syncing[row.original._id]}
                title="Sync with Razorpay"
              >
                {syncing[row.original._id] ? '...' : '🔄'}
              </Button>
            )}
          </div>
        ),
        enableSorting: false,
      },
    ],
    [syncing]
  );

  return (
    <>
      <Card>
        <Card.Header>
          <Card.Title>All Orders</Card.Title>
        </Card.Header>
      </Card>
      <DataTable
        data={orders}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search orders by ID, customer name..."
        pageSize={10}
      />
    </>
  );
};

export default AdminOrders;

