import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CATEGORIES = [
  'ПК', 'Ноутбуки', 'Мониторы', 'Мыши', 'Клавиатуры',
  'Процессоры', 'Накопители', 'Видеокарты', 'Корпуса', 'Блоки питания'
];

function AdminPage() {
  const [prods, setProds] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [specs, setSpecs] = useState('');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState('');
  const [editId, setEditId] = useState(null);
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProds(res.data))
      .catch(err => console.error('Ошибка загрузки товаров:', err));
  };

  const add = async e => {
    e.preventDefault();
    if (!name || !price || !category) return alert('Заполните все поля');

    try {
      const { data } = await axios.post('http://localhost:5000/api/products', {
        name,
        price: parseFloat(price),
        category,
        brand,
        specs,
        image,
        stock: parseInt(stock) || 0,
        rating: 0,
        description: ''
      });

      setProds([...prods, data]);
      setName(''); setPrice(''); setCategory('');
      setBrand(''); setSpecs(''); setImage(''); setStock('');
    } catch (err) {
      console.error('Ошибка при добавлении товара:', err.response?.data || err.message);
      alert('Ошибка при добавлении товара. Проверь консоль.');
    }
  };

  const startEdit = (product) => {
    setEditId(product._id);
    setEditDescription(product.description || '');
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditDescription('');
  };

  const saveDescription = async () => {
    try {
      await axios.patch(`http://localhost:5000/api/products/${editId}`, { description: editDescription });
      alert('Описание обновлено');
      setEditId(null);
      setEditDescription('');
      fetchProducts();
    } catch (err) {
      alert('Ошибка при обновлении описания');
      console.error(err);
    }
  };

  // --- Стили ---
  const formStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 30,
    background: '#f9f9f9',
    padding: 15,
    borderRadius: 6,
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  };

  const inputStyle = {
    padding: 8,
    borderRadius: 4,
    border: '1px solid #ccc',
    minWidth: 150,
    flexGrow: 1,
  };

  const buttonStyle = {
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    padding: '8px 16px',
    cursor: 'pointer',
    flexShrink: 0,
  };

  const productItemStyle = {
    border: '1px solid #ddd',
    padding: 15,
    borderRadius: 6,
    marginBottom: 15,
    background: 'white',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  };

  const descriptionStyle = {
    whiteSpace: 'pre-wrap',
    marginTop: 8,
    marginBottom: 8,
    color: '#444',
    minHeight: 50,
  };

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 25 }}>Админка</h2>
      <form onSubmit={add} style={formStyle}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Название"
          style={inputStyle}
          required
        />
        <input
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder="Цена"
          type="number"
          style={{ ...inputStyle, maxWidth: 100 }}
          required
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={inputStyle}
          required
        >
          <option value="">Выберите категорию</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          value={brand}
          onChange={e => setBrand(e.target.value)}
          placeholder="Бренд"
          style={inputStyle}
        />
        <input
          value={specs}
          onChange={e => setSpecs(e.target.value)}
          placeholder="Характеристики"
          style={inputStyle}
        />
        <input
          value={image}
          onChange={e => setImage(e.target.value)}
          placeholder="URL изображения"
          style={inputStyle}
        />
        <input
          value={stock}
          onChange={e => setStock(e.target.value)}
          placeholder="В наличии"
          type="number"
          style={{ ...inputStyle, maxWidth: 100 }}
        />
        <button type="submit" style={buttonStyle}>Добавить</button>
      </form>

      <ul style={{ padding: 0, listStyle: 'none' }}>
        {prods.map(p => (
          <li key={p._id} style={productItemStyle}>
            <strong>{p.name}</strong> — <span style={{ color: '#007bff' }}>{Number(p.price).toLocaleString('ru-RU')} ₸</span> [{p.category}]
            <br />
            {editId === p._id ? (
              <>
                <textarea
                  rows={4}
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc', marginTop: 10 }}
                />
                <div style={{ marginTop: 10 }}>
                  <button onClick={saveDescription} style={{ ...buttonStyle, marginRight: 10 }}>Сохранить</button>
                  <button onClick={cancelEdit} style={{ ...buttonStyle, background: '#6c757d' }}>Отмена</button>
                </div>
              </>
            ) : (
              <>
                <div style={descriptionStyle}>
                  {p.description || <i style={{ color: '#999' }}>Описание отсутствует</i>}
                </div>
                <button onClick={() => startEdit(p)} style={{ ...buttonStyle, background: '#28a745' }}>
                  Редактировать описание
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPage;
