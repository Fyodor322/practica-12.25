import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/profile/', {
        credentials: 'include'
      });
      setIsLoggedIn(response.ok);
    } catch (err) {
      setIsLoggedIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/api/logout/', {
        method: 'POST',
        credentials: 'include'
      });
      setIsLoggedIn(false);
      navigate('/');
    } catch (err) {
      console.error('Ошибка выхода:', err);
    }
  };

  return (
    <header>
      <Link to="/" className="logo">
        <img src="/assets/logo.png" alt="Большая Шишка" />
      </Link>
      <nav>
        <ul>
          <li><Link to="/menu">меню</Link></li>
          <li><Link to="/about">о нас</Link></li>
          {isLoggedIn ? (
            <>
              <li><Link to="/profile">личный кабинет</Link></li>
              <li><button onClick={handleLogout} style={{background: 'none', border: 'none', color: 'black', fontSize: '25px', fontWeight: 'bold', cursor: 'pointer', padding: 0, margin: 0}}>выход</button></li>
            </>
          ) : (
            <>
              <li><Link to="/signin">вход</Link></li>
              <li><Link to="/registration">регистрация</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;