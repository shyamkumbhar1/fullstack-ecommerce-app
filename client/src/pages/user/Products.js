import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { productsAPI, cartAPI } from '../../services/api';
import Loading from '../../components/Loading';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { BACKEND_URL } from '../../utils/constants';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useContext(AuthContext);

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

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await cartAPI.add({ productId, quantity: 1 });
      toast.success('Product added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (loading) return <Loading />;

  return (
    <Container className="my-5">
      <h2 className="mb-4">All Products</h2>
      <Row>
        {products.length === 0 ? (
          <Col>
            <p className="text-center">No products available</p>
          </Col>
        ) : (
          products.map((product) => (
            <Col key={product._id} md={4} className="mb-4">
              <Card>
                <Card.Img
                  variant="top"
                  src={product.image ? `${BACKEND_URL}${product.image}` : 'https://via.placeholder.com/300'}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>{product.description}</Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5>₹{product.price}</h5>
                      {product.stock > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Out of Stock</Badge>
                      )}
                    </div>
                  </div>
                  <div className="mt-3">
                    <Button
                      as={Link}
                      to={`/products/${product._id}`}
                      variant="outline-primary"
                      className="me-2"
                    >
                      View Details
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => handleAddToCart(product._id)}
                      disabled={product.stock === 0}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default Products;

