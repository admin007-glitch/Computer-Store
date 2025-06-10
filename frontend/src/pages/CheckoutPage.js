import React from 'react';
import axios from 'axios';

const formatPrice = (price) =>
  price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₸';

export default function CheckoutPage({ cartItems, user, setCartItems }) {
  const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  const placeOrder = async () => {
    if (!user?.email) {
      alert('Пожалуйста, войдите в систему');
      return;
    }

    const formattedOrderItems = cartItems.map(item => ({
      name: item.name,
      qty: item.qty,
      price: item.price,
      _id: item._id.toString(),
    }));

    try {
      const res = await axios.post('http://localhost:5000/api/orders', {
        email: user.email,
        orderItems: formattedOrderItems,
        totalPrice,
      });

      if (res.status === 201 || res.status === 200) {
        setCartItems([]);
        alert('Заказ успешно создан!');
      } else {
        alert('Ошибка при оформлении заказа: сервер вернул статус ' + res.status);
      }
    } catch (error) {
      alert('Ошибка при оформлении заказа: ' + (error.response?.data?.message || error.message || 'неизвестная ошибка'));
    }
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: '40px auto',
        padding: 25,
        backgroundColor: '#fff',
        borderRadius: 10,
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#333',
      }}
    >
      <h1 style={{ marginBottom: 30, fontWeight: '700', fontSize: 32, textAlign: 'center' }}>
        Оформление заказа
      </h1>

      {cartItems.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: 18, color: '#777' }}>Корзина пуста</p>
      ) : (
        <div>
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: 30 }}>
            {cartItems.map((item) => (
              <li
                key={item._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '1px solid #eee',
                  fontSize: 18,
                }}
              >
                <span>{item.name} x {item.qty}</span>
                <span>{formatPrice(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>

          <h3
            style={{
              textAlign: 'right',
              marginBottom: 25,
              fontWeight: '700',
              fontSize: 22,
              color: '#222',
            }}
          >
            Итого: {formatPrice(totalPrice)}
          </h3>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={placeOrder}
              style={{
                backgroundColor: '#1e88e5',
                color: '#fff',
                border: 'none',
                padding: '14px 40px',
                fontSize: 18,
                fontWeight: '700',
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                boxShadow: '0 4px 8px rgba(30, 136, 229, 0.4)',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#1565c0')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#1e88e5')}
            >
              Оформить заказ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
