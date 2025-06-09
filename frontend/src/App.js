import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link
} from 'react-router-dom';

import Home from './pages/Home';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import AdminPage from './pages/AdminPage';
import UserAuth from './components/UserAuth';

function Navbar({ user, setUser }) {
  return (
    <nav style={{ padding: 10, background: '#f0f0f0' }}>
      <Link to="/" style={{ margin: 5 }}>Каталог</Link>
      <Link to="/cart" style={{ margin: 5 }}>Корзина</Link>
      <Link to="/checkout" style={{ margin: 5 }}>Оформление</Link>
      <Link to="/orders" style={{ margin: 5 }}>Заказы</Link>
      <Link to="/admin" style={{ margin: 5 }}>Админка</Link>
      {user ? (
        <button onClick={() => {
          setUser(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }} style={{ marginLeft: 10 }}>Выйти</button>
      ) : (
        <Link to="/login" style={{ marginLeft: 10 }}>Войти</Link>
      )}
    </nav>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem('cartItems')) || []
  );

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const handleAddToCart = product => {
    const exist = cartItems.find(x => x._id === product._id);
    if (exist) {
      setCartItems(cartItems.map(x =>
        x._id === product._id ? { ...exist, qty: exist.qty + 1 } : x
      ));
    } else {
      setCartItems([...cartItems, { ...product, qty: 1 }]);
    }
  };

  const handleRemove = item =>
    setCartItems(cartItems.filter(x => x._id !== item._id));

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home products={products} onAdd={handleAddToCart} />} />
        <Route path="/cart" element={
          <CartPage cartItems={cartItems} onRemove={handleRemove} />
        } />
        <Route path="/checkout" element={
          user ? (
            <CheckoutPage cartItems={cartItems} user={user} setCartItems={setCartItems} />
          ) : (
            <Navigate to="/login" />
          )
        } />
        <Route path="/orders" element={
          user ? <OrdersPage user={user} /> : <Navigate to="/login" />
        } />
        <Route path="/admin" element={
          user && user.isAdmin ? <AdminPage /> : <Navigate to="/" />
        } />
        <Route path="/login" element={
          user ? <Navigate to="/" /> : <UserAuth setUser={setUser} />
        } />
      </Routes>
    </Router>
  );
}

export default App;
