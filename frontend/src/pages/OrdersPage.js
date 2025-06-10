import React, { useEffect, useState } from 'react';

export default function OrdersPage({ user }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user?.email) return;

    fetch(`http://localhost:5000/api/orders?email=${encodeURIComponent(user.email)}`)
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(console.error);
  }, [user]);

  return (
    <div
      style={{
        maxWidth: 800,
        margin: '40px auto',
        padding: 25,
        backgroundColor: '#fff',
        borderRadius: 10,
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#333',
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: 30, fontWeight: '700', fontSize: 32 }}>
        Мои заказы
      </h1>

      {orders.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: 18, color: '#777' }}>Заказов нет</p>
      ) : (
        orders.map(order => (
          <div
            key={order._id}
            style={{
              borderBottom: '1px solid #eee',
              paddingBottom: 20,
              marginBottom: 20,
            }}
          >
            <h3 style={{ marginBottom: 10, color: '#1e88e5' }}>Заказ #{order._id}</h3>
            <p style={{ margin: '5px 0' }}>
              <strong>Дата:</strong> {new Date(order.createdAt).toLocaleString()}
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Статус:</strong>{' '}
              <span
                style={{
                  color:
                    order.status.toLowerCase() === 'выполнен'
                      ? 'green'
                      : order.status.toLowerCase() === 'отменен'
                      ? 'red'
                      : '#333',
                  fontWeight: '600',
                }}
              >
                {order.status}
              </span>
            </p>
            <p style={{ margin: '5px 0 15px', fontWeight: '700', fontSize: 18 }}>
              Итого: {order.totalPrice.toLocaleString('ru-RU')} ₸
            </p>

            <ul style={{ paddingLeft: 20, margin: 0, listStyleType: 'disc' }}>
              {order.orderItems.map(item => (
                <li
                  key={item._id}
                  style={{
                    marginBottom: 6,
                    fontSize: 16,
                    display: 'flex',
                    justifyContent: 'space-between',
                    maxWidth: 600,
                  }}
                >
                  <span>{item.name} x {item.qty}</span>
                  <span>{item.price.toLocaleString('ru-RU')} ₸</span>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
