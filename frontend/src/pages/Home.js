// src/pages/Home.js
import React, { useState } from 'react';

function formatPrice(price) {
  // Форматируем число с пробелами как разделителями тысяч и двумя знаками после запятой
  return `${price.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₸`;
}

const Home = ({ products, onAdd }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [comments, setComments] = useState({});

  const handleReviewSubmit = async (productId) => {
    const comment = comments[productId];
    if (!comment || comment.trim() === '') return;
    try {
      const res = await fetch(`http://localhost:5000/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment }),
      });
      if (res.ok) {
        alert('Отзыв добавлен!');
        setComments({ ...comments, [productId]: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = products.filter((p) =>
    (!search || p.name.toLowerCase().includes(search.toLowerCase())) &&
    (!category || p.category === category)
  );

  const uniqueCategories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  return (
    <div style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 20, fontSize: 28 }}>Каталог товаров</h2>

      {/* Поиск и фильтрация */}
      <div
        style={{
          marginBottom: 30,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          placeholder="Поиск..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: 8,
            fontSize: 16,
            flex: '1 1 200px',
            borderRadius: 4,
            border: '1px solid #ccc',
          }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: 8,
            fontSize: 16,
            flex: '1 1 200px',
            borderRadius: 4,
            border: '1px solid #ccc',
          }}
        >
          <option value="">Все категории</option>
          {uniqueCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Товары */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
        {filtered.map((p) => (
          <div
            key={p._id}
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: 16,
              width: 280,
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              backgroundColor: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <img
              src={p.image}
              alt={p.name}
              style={{
                width: '100%',
                height: 160,
                objectFit: 'contain',
                marginBottom: 12,
              }}
            />
            <h3 style={{ margin: '8px 0' }}>{p.name}</h3>
            <p style={{ margin: '4px 0', fontSize: 14, color: '#666' }}>{p.specs}</p>

            <div
              style={{
                whiteSpace: 'pre-wrap',
                margin: '8px 0',
                color: '#444',
                minHeight: 50,
                fontSize: 14,
              }}
            >
              {p.description ? (
                p.description
              ) : (
                <i style={{ color: '#999' }}>Описание отсутствует</i>
              )}
            </div>

            <p style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
              {formatPrice(p.price)}
            </p>
            <button
              onClick={() => onAdd(p)}
              style={{
                padding: '8px 12px',
                fontSize: 14,
                backgroundColor: '#1e88e5',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              В корзину
            </button>

            {/* Отзывы */}
            {Array.isArray(p.reviews) && p.reviews.length > 0 && (
              <ul style={{ marginTop: 10, fontSize: 13, paddingLeft: 16, color: '#333' }}>
                {p.reviews.map((r, i) => (
                  <li key={i}>"{r.comment}"</li>
                ))}
              </ul>
            )}

            {/* Форма отзыва */}
            <textarea
              rows="2"
              placeholder="Оставьте отзыв"
              value={comments[p._id] || ''}
              onChange={(e) =>
                setComments({ ...comments, [p._id]: e.target.value })
              }
              style={{
                width: '100%',
                marginTop: 10,
                padding: 8,
                fontSize: 14,
                borderRadius: 4,
                border: '1px solid #ccc',
                resize: 'vertical',
              }}
            />
            <button
              onClick={() => handleReviewSubmit(p._id)}
              style={{
                marginTop: 6,
                padding: '6px 10px',
                fontSize: 13,
                backgroundColor: '#4caf50',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              Отправить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
