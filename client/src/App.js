import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Components (Keep these as regular imports - used on most pages)
import Header from './components/Header';
import Footer from './components/Footer';
import Loading from './components/Loading';

// Lazy load User Pages for faster initial load
const Home = lazy(() => import('./pages/user/Home'));
const Login = lazy(() => import('./pages/user/Login'));
const Register = lazy(() => import('./pages/user/Register'));
const Products = lazy(() => import('./pages/user/Products'));
const ProductDetail = lazy(() => import('./pages/user/ProductDetail'));
const Cart = lazy(() => import('./pages/user/Cart'));
const Checkout = lazy(() => import('./pages/user/Checkout'));
const MyOrders = lazy(() => import('./pages/user/MyOrders'));
const OrderDetails = lazy(() => import('./pages/user/OrderDetails'));

// Lazy load Admin Pages for faster initial load
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const AddProduct = lazy(() => import('./pages/admin/AddProduct'));
const EditProduct = lazy(() => import('./pages/admin/EditProduct'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AddUser = lazy(() => import('./pages/admin/AddUser'));

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading } = React.useContext(AuthContext);

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <div className="App d-flex flex-column min-vh-100">
          <Suspense fallback={<Loading />}>
            <Routes>
            {/* User Routes */}
            <Route path="/" element={
              <>
                <Header />
                <Home />
                <Footer />
              </>
            } />
            <Route path="/products" element={
              <>
                <Header />
                <Products />
                <Footer />
              </>
            } />
            <Route path="/products/:id" element={
              <>
                <Header />
                <ProductDetail />
                <Footer />
              </>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <Cart />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <Checkout />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <MyOrders />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            <Route path="/orders/:id" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <OrderDetails />
                  <Footer />
                </>
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/products" element={
              <ProtectedRoute adminOnly={true}>
                <AdminLayout>
                  <AdminProducts />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/products/add" element={
              <ProtectedRoute adminOnly={true}>
                <AdminLayout>
                  <AddProduct />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/products/edit/:id" element={
              <ProtectedRoute adminOnly={true}>
                <AdminLayout>
                  <EditProduct />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/orders" element={
              <ProtectedRoute adminOnly={true}>
                <AdminLayout>
                  <AdminOrders />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute adminOnly={true}>
                <AdminLayout>
                  <AdminUsers />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/users/add" element={
              <ProtectedRoute adminOnly={true}>
                <AdminLayout>
                  <AddUser />
                </AdminLayout>
              </ProtectedRoute>
            } />
            </Routes>
          </Suspense>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

