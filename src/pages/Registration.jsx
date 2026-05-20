import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Registration = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    birth_date: '',
    phone: '',
    password: '',
    agreement: false
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.agreement) {
      setError('Необходимо согласие на обработку данных');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Регистрация успешна!');
        navigate('/signin');
      } else {
        const data = await response.json();
        setError(Object.values(data).flat().join(', '));
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    }
  };

  return (
    <main>
      <h2>Регистрация</h2>
      <div className="auth-container">
        <div className="auth-image">
          <img src="/assets/regVhod.jpg" alt="Регистрация" />
        </div>
        <form className="registration" onSubmit={handleSubmit}>
        {error && <p style={{color: 'red'}}>{error}</p>}
        
        <p>Имя</p>
        <input 
          type="text" 
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        
        <p>Фамилия</p>
        <input 
          type="text" 
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
        
        <p>Логин</p>
        <input 
          type="text" 
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        
        <p>Почта</p>
        <input 
          type="email" 
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <p>Дата рождения</p>
        <input 
          type="date" 
          name="birth_date"
          value={formData.birth_date}
          onChange={handleChange}
        />
        
        <p>Телефон</p>
        <input 
          type="tel" 
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        
        <p>Пароль</p>
        <input 
          type="password" 
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        
        <div className="checkboxDiv">
          <input 
            type="checkbox" 
            className="checkbox"
            name="agreement"
            checked={formData.agreement}
            onChange={handleChange}
          />
          <p>согласие на обработку персональных данных</p>
        </div>
        
        <button type="submit" className="registButton">Регистрация</button>
        <Link to="/signin" className="signInA">Войти</Link>
      </form>
      </div>
    </main>
  );
};

export default Registration;