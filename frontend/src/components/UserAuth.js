import React, { useState } from 'react';

const BASE_URL = process.env.REACT_APP_API_URL;

export default function UserAuth({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const url = isRegister
      ? `${BASE_URL}/api/users/register`
      : `${BASE_URL}/api/users/login`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser({ email, isAdmin: data.isAdmin });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ email, isAdmin: data.isAdmin }));
        setMessage('');
      } else {
        setMessage(data.message || 'Ошибка входа');
      }
    } catch (err) {
      setMessage('Ошибка сети');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>{isRegister ? 'Регистрация' : 'Вход'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <button type="submit" style={{ width: '100%', padding: 10 }}>
          {isRegister ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </form>
      <p style={{ color: 'red' }}>{message}</p>
      <p style={{ marginTop: 10 }}>
        {isRegister ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}{' '}
        <button type="button" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </p>
    </div>
  );
}
