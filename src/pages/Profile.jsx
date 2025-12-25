import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/profile/', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setEditData({
          first_name: data.user.first_name,
          last_name: data.user.last_name,
          email: data.user.email,
          birth_date: data.birth_date || '',
          phone: data.phone || ''
        });
      }
    } catch (err) {
      console.error('Ошибка загрузки профиля:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/profile/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editData)
      });
      if (response.ok) {
        await fetchProfile();
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Ошибка сохранения:', err);
    }
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <main><h1>Загрузка...</h1></main>;
  if (!user) return <main><h1>Необходимо войти в систему</h1></main>;

  return (
    <main>
      <h1>Личный кабинет</h1>
      <div className="profile-container">
        <div className="profile-info">
          <div className="profile-avatar">
            <img src="/assets/lk1.jpg" alt="Аватар" />
          </div>
          <div className="profile-details">
            {isEditing ? (
              <div className="registration">
                <p>Имя</p>
                <input
                  type="text"
                  name="first_name"
                  value={editData.first_name}
                  onChange={handleChange}
                />
                <p>Фамилия</p>
                <input
                  type="text"
                  name="last_name"
                  value={editData.last_name}
                  onChange={handleChange}
                />
                <p>Email</p>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleChange}
                />
                <p>Дата рождения</p>
                <input
                  type="date"
                  name="birth_date"
                  value={editData.birth_date}
                  onChange={handleChange}
                />
                <p>Телефон</p>
                <input
                  type="tel"
                  name="phone"
                  value={editData.phone}
                  onChange={handleChange}
                />
                <div className="profile-buttons">
                  <button onClick={handleSave}>Сохранить</button>
                  <button onClick={() => setIsEditing(false)}>Отмена</button>
                </div>
              </div>
            ) : (
              <div className="profile-view">
                <h3>Информация о пользователе</h3>
                <p><strong>Имя:</strong> {user.user.first_name} {user.user.last_name}</p>
                <p><strong>Email:</strong> {user.user.email}</p>
                <p><strong>Дата рождения:</strong> {user.birth_date || 'Не указана'}</p>
                <p><strong>Телефон:</strong> {user.phone || 'Не указан'}</p>
                <button onClick={() => setIsEditing(true)}>Редактировать</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;