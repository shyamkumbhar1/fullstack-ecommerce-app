import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cartAPI, ordersAPI } from '../../services/api';
import Loading from '../../components/Loading';
import RazorpayCheckout from '../../components/RazorpayCheckout';

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.get();
      if (response.data.data.items.length === 0) {
        toast.error('Your cart is empty');
        navigate('/cart');
        return;
      }
      setCart(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await ordersAPI.create({
        shippingAddress: formData,
        paymentMethod: paymentMethod
      });

      const createdOrder = response.data.data;

      if (paymentMethod === 'COD') {
        toast.success('Order placed successfully!');
        navigate('/orders');
      } else {
        // For Razorpay, store order and show payment button
        setOrder(createdOrder);
        toast.info('Please complete the payment');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = (orderData) => {
    toast.success('Payment successful! Order placed.');
    navigate('/orders');
  };

  const handlePaymentFailure = () => {
    toast.error('Payment failed. Please try again.');
    setOrder(null);
  };

  if (loading) return <Loading />;
  if (!cart || cart.items.length === 0) return null;

  const shippingPrice = 20;
  const totalPrice = cart.total + shippingPrice;

  return (
    <Container className="my-5">
      <h2 className="mb-4">Checkout</h2>
      <Row>
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>Shipping Address</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Street Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>State</Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Zip Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Country</Form.Label>
                      <Form.Control
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Payment Method</Form.Label>
                  <Form.Select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled={submitting || order !== null}
                  >
                    <option value="COD">Cash on Delivery (COD)</option>
                    <option value="RAZORPAY">Razorpay (Online Payment)</option>
                  </Form.Select>
                </Form.Group>
                {!order ? (
                  <Button type="submit" variant="primary" disabled={submitting}>
                    {submitting ? 'Placing Order...' : 'Place Order'}
                  </Button>
                ) : (
                  <RazorpayCheckout
                    orderId={order._id}
                    amount={order.totalPrice}
                    onSuccess={handlePaymentSuccess}
                    onFailure={handlePaymentFailure}
                  />
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <div className="mb-2">
                <strong>Subtotal:</strong> ₹{cart.total}
              </div>
              <div className="mb-2">
                <strong>Shipping:</strong> ₹{shippingPrice}
              </div>
              <hr />
              <div className="mb-2">
                <h5><strong>Total:</strong> ₹{totalPrice}</h5>
              </div>
              <Alert variant="info" className="mt-3">
                Payment Method: {paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Razorpay (Online Payment)'}
              </Alert>
              {order && order.paymentMethod === 'RAZORPAY' && (
                <Alert variant="warning" className="mt-2">
                  Please complete the payment to confirm your order.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;

