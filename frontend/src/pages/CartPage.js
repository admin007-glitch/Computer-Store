import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const formatPrice = (price) =>
  price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₸';

export default function CartPage({ cartItems, onRemove }) {
  const [items, setItems] = useState(cartItems || []);
  const navigate = useNavigate();

  // Пример загрузки корзины с backend (localhost)
  useEffect(() => {
    axios.get('http://localhost:5000/api/cart')
      .then(res => setItems(res.data))
      .catch(err => console.error('Ошибка загрузки корзины:', err));
  }, []);

  // Подсчёт общей суммы
  const total = items.reduce((acc, item) => acc + item.price * item.qty, 0);

  // Удаление с backend и обновление локального состояния
  const handleRemove = (item) => {
    axios.delete(`http://localhost:5000/api/cart/${item._id}`)
      .then(() => {
        const updated = items.filter(i => i._id !== item._id);
        setItems(updated);
        if (onRemove) onRemove(item);
      })
      .catch(err => console.error('Ошибка удаления из корзины:', err));
  };

  return (
    <div
      style={{
        maxWidth: 800,
        margin: '40px auto',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: 30, color: '#333', fontWeight: '700', fontSize: 32 }}>
        Корзина
      </h1>

      {items.length === 0 && (
        <p style={{ fontSize: 18, color: '#666', textAlign: 'center' }}>
          Корзина пуста
        </p>
      )}

      {items.map((item) => (
        <div
          key={item._id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 0',
            borderBottom: '1px solid #eee',
          }}
        >
          <div>
            <h3 style={{ margin: '0 0 6px', color: '#222' }}>{item.name}</h3>
            <p style={{ margin: '2px 0', color: '#555' }}>
              Количество: <strong>{item.qty}</strong>
            </p>
            <p style={{ margin: '2px 0', color: '#555' }}>
              Цена за шт.: <strong>{formatPrice(item.price)}</strong>
            </p>
          </div>
          <div>
            <button
              onClick={() => handleRemove(item)}
              style={{
                backgroundColor: '#e53935',
                color: '#fff',
                border: 'none',
                padding: '8px 14px',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#b71c1c')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#e53935')}
            >
              Удалить
            </button>
          </div>
        </div>
      ))}

      {items.length > 0 && (
        <>
          <h2
            style={{
              marginTop: 30,
              fontSize: 24,
              fontWeight: '700',
              color: '#222',
              textAlign: 'right',
            }}
          >
            Итого: {formatPrice(total)}
          </h2>
          <div style={{ textAlign: 'right', marginTop: 20 }}>
            <button
              onClick={() => navigate('/checkout')}
              style={{
                backgroundColor: '#1e88e5',
                color: '#fff',
                padding: '12px 28px',
                fontSize: 16,
                fontWeight: '700',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#1565c0')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#1e88e5')}
            >
              Оформить заказ
            </button>
          </div>
        </>
      )}
    </div>
  );
}
