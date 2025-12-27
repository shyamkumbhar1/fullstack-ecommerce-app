import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Table, Badge, Row, Col } from 'react-bootstrap';
import { ordersAPI } from '../../services/api';
import Loading from '../../components/Loading';
import { ORDER_STATUS_LABELS } from '../../utils/constants';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await ordersAPI.getOrder(id);
      setOrder(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order:', error);
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      default:
        return 'secondary';
    }
  };

  if (loading) return <Loading />;
  if (!order) return <Container className="my-5"><p>Order not found</p></Container>;

  return (
    <Container className="my-5">
      <Link to="/orders" className="mb-3 d-inline-block">← Back to Orders</Link>
      <h2 className="mb-4">Order Details</h2>
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Order Items</Card.Title>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.product?.name || 'Product'}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.price}</td>
                      <td>₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Order Information</Card.Title>
              <p><strong>Order ID:</strong> #{order._id.slice(-6)}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <p>
                <strong>Status:</strong>{' '}
                <Badge bg={getStatusVariant(order.status)}>
                  {ORDER_STATUS_LABELS[order.status]}
                </Badge>
              </p>
              <hr />
              <p><strong>Subtotal:</strong> ₹{order.totalPrice - order.shippingPrice}</p>
              <p><strong>Shipping:</strong> ₹{order.shippingPrice}</p>
              <p><strong>Total:</strong> ₹{order.totalPrice}</p>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <Card.Title>Shipping Address</Card.Title>
              <p>
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                {order.shippingAddress.zipCode}<br />
                {order.shippingAddress.country}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderDetails;

