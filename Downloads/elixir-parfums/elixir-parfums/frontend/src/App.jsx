import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/common/Navbar';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import OrdersPage from './pages/OrdersPage';
import ProductPage from './pages/ProductPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import OrangeMoneyConfirmPage from './pages/OrangeMoneyConfirmPage';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ style: { background: '#1A1A1A', color: '#fff', border: '1px solid #333' } }} />
          <Navbar />
          <Routes>
            <Route path="/"               element={<HomePage />} />
            <Route path="/produit/:id"    element={<ProductPage />} />
            <Route path="/login"          element={<LoginPage />} />
            <Route path="/panier"         element={<CartPage />} />
            <Route path="/checkout"       element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
            <Route path="/mes-commandes"  element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
            <Route path="/paiement-orange-money" element={<PrivateRoute><OrangeMoneyConfirmPage /></PrivateRoute>} />
            <Route path="/admin"          element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/produits" element={<AdminRoute><AdminProducts /></AdminRoute>} />
            <Route path="/admin/commandes"element={<AdminRoute><AdminOrders /></AdminRoute>} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
