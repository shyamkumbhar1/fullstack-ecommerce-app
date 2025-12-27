import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cartAPI } from '../../services/api';
import Loading from '../../components/Loading';
import { BACKEND_URL } from '../../utils/constants';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.get();
      setCart(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await cartAPI.update(itemId, { quantity: newQuantity });
      setCart(response.data.data);
      toast.success('Cart updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update cart');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      const response = await cartAPI.remove(itemId);
      setCart(response.data.data);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  if (loading) return <Loading />;

  if (!cart || cart.items.length === 0) {
    return (
      <Container className="my-5">
        <Card>
          <Card.Body className="text-center py-5">
            <h3>Your cart is empty</h3>
            <p>Add some products to your cart!</p>
            <Button as={Link} to="/products" variant="primary">
              Browse Products
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4">Shopping Cart</h2>
      <Card>
        <Card.Body>
          <Table responsive>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={item.product.image ? `${BACKEND_URL}${item.product.image}` : 'https://via.placeholder.com/50'}
                        alt={item.product.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
                      />
                      <div>
                        <strong>{item.product.name}</strong>
                        {item.product.stock < item.quantity && (
                          <Badge bg="warning" className="ms-2">Low Stock</Badge>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>₹{item.price}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span className="mx-2">{item.quantity}</span>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                      >
                        +
                      </Button>
                    </div>
                  </td>
                  <td>₹{item.price * item.quantity}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemove(item._id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                <td><strong>₹{cart.total}</strong></td>
                <td></td>
              </tr>
            </tfoot>
          </Table>
          <div className="text-end mt-3">
            <Button as={Link} to="/products" variant="outline-secondary" className="me-2">
              Continue Shopping
            </Button>
            <Button variant="primary" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Cart;

