import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { productsAPI } from '../../services/api';
import Loading from '../../components/Loading';
import { BACKEND_URL } from '../../utils/constants';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data.data.slice(0, 6)); // Show only 6 products on home
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <Container className="my-5">
      <div className="text-center mb-5">
        <h1>Welcome to ShopEasy</h1>
        <p className="lead">Your one-stop shop for Maggi products</p>
      </div>

      <h2 className="mb-4">Featured Products</h2>
      <Row>
        {products.map((product) => (
          <Col key={product._id} md={4} className="mb-4">
            <Card>
              <Card.Img
                variant="top"
                src={product.image ? `${BACKEND_URL}${product.image}` : 'https://via.placeholder.com/300'}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>₹{product.price}</Card.Text>
                <Button as={Link} to={`/products/${product._id}`} variant="primary">
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="text-center mt-4">
        <Button as={Link} to="/products" variant="outline-primary" size="lg">
          View All Products
        </Button>
      </div>
    </Container>
  );
};

export default Home;

