import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { ordersAPI, productsAPI, usersAPI } from '../../services/api';
import Loading from '../../components/Loading';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        ordersAPI.getAll(),
        productsAPI.getAll(),
        usersAPI.getAll()
      ]);

      const orders = ordersRes.data.data;
      const products = productsRes.data.data;
      const users = usersRes.data.data;

      const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
      const pendingOrders = orders.filter(order => order.status === 'pending').length;

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalProducts: products.length,
        totalUsers: users.length,
        pendingOrders
      });

      setRecentOrders(orders.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <Row>
        <Col md={3}>
          <Card className="info-box mb-3">
            <Card.Body>
              <div className="info-box-content">
                <span className="info-box-text">Total Orders</span>
                <span className="info-box-number">{stats.totalOrders}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="info-box mb-3 bg-success">
            <Card.Body>
              <div className="info-box-content">
                <span className="info-box-text">Total Revenue</span>
                <span className="info-box-number">₹{stats.totalRevenue}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="info-box mb-3 bg-info">
            <Card.Body>
              <div className="info-box-content">
                <span className="info-box-text">Total Products</span>
                <span className="info-box-number">{stats.totalProducts}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="info-box mb-3 bg-warning">
            <Card.Body>
              <div className="info-box-content">
                <span className="info-box-text">Pending Orders</span>
                <span className="info-box-number">{stats.pendingOrders}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              <Card.Title>Recent Orders</Card.Title>
            </Card.Header>
            <Card.Body>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center">No orders yet</td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td>#{order._id.slice(-6)}</td>
                        <td>{order.user?.name || 'N/A'}</td>
                        <td>₹{order.totalPrice}</td>
                        <td>
                          <span className={`badge bg-${order.status === 'pending' ? 'warning' : order.status === 'delivered' ? 'success' : 'info'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;

