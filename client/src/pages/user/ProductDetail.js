import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { productsAPI, cartAPI } from '../../services/api';
import Loading from '../../components/Loading';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { BACKEND_URL } from '../../utils/constants';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getById(id);
      setProduct(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/products');
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available`);
      return;
    }

    try {
      await cartAPI.add({ productId: id, quantity });
      toast.success('Product added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (loading) return <Loading />;
  if (!product) return null;

  return (
    <Container className="my-5">
      <Row>
        <Col md={6}>
          <Card>
            <Card.Img
              variant="top"
              src={product.image ? `${BACKEND_URL}${product.image}` : 'https://via.placeholder.com/500'}
              style={{ height: '400px', objectFit: 'cover' }}
            />
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title className="h2">{product.name}</Card.Title>
              <Card.Text className="lead">₹{product.price}</Card.Text>
              <Card.Text>{product.description}</Card.Text>
              <div className="mb-3">
                {product.stock > 0 ? (
                  <Badge bg="success">In Stock ({product.stock} available)</Badge>
                ) : (
                  <Badge bg="danger">Out of Stock</Badge>
                )}
              </div>
              {product.stock > 0 && (
                <div className="mb-3">
                  <label>Quantity: </label>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="form-control d-inline-block w-auto ms-2"
                  />
                </div>
              )}
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-100"
              >
                Add to Cart
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;

