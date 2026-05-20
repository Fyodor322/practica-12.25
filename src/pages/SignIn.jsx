import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    console.log('Отправка данных:', formData); 

    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      console.log('Ответ сервера:', response.status); 

      if (response.ok) {
        const data = await response.json();
        console.log('Успешный вход:', data); 
        window.location.href = '/profile'; 
      } else {
        const errorData = await response.json();
        console.log('Ошибка входа:', errorData); 
        setError(errorData.error || 'Неверные данные');
      }
    } catch (err) {
      console.error('Ошибка сети:', err); 
      setError('Ошибка соединения с сервером');
    }
  };

  return (
    <main>
      <h2>Вход</h2>
      <div className="auth-container">
        <div className="auth-image">
          <img src="/assets/regVhod.jpg" alt="Вход" />
        </div>
        <form className="registration" onSubmit={handleSubmit}>
        {error && <p style={{color: 'red'}}>{error}</p>}
        
        <p>Логин</p>
        <input 
          type="text" 
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        
        <p>Пароль</p>
        <input 
          type="password" 
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        
        <button type="submit" className="registButton">Войти</button>
        <Link to="/registration" className="signInA">Регистрация</Link>
      </form>
      </div>
    </main>
  );
};

export default SignIn;