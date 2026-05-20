import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchReviews();
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
      const formData = new FormData();
      formData.append('first_name', editData.first_name || '');
      formData.append('last_name', editData.last_name || '');
      formData.append('email', editData.email || '');
      if (editData.birth_date) formData.append('birth_date', editData.birth_date);
      if (editData.phone) formData.append('phone', editData.phone);
      if (avatarFile) formData.append('avatar', avatarFile);

      const response = await fetch('http://localhost:8000/api/profile/', {
        method: 'PUT',
        credentials: 'include',
        body: formData
      });
      
      if (response.ok) {
        await fetchProfile();
        setIsEditing(false);
        setAvatarFile(null);
        alert('Профиль успешно обновлён');
      } else {
        const error = await response.json();
        alert('Ошибка: ' + JSON.stringify(error));
      }
    } catch (err) {
      console.error('Ошибка сохранения:', err);
      alert('Ошибка сохранения: ' + err.message);
    }
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleExport = async (format) => {
    try {
      const response = await fetch(`http://localhost:8000/api/export/bookings/${format}/`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Ошибка экспорта');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookings.${format === 'word' ? 'docx' : format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Ошибка при экспорте: ' + error.message);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/reviews/', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Отзывы:', data);
        setReviews(data);
      } else {
        console.error('Ошибка загрузки отзывов:', response.status);
      }
    } catch (err) {
      console.error('Ошибка загрузки отзывов:', err);
    }
  };

  if (loading) return <main><h1>Загрузка...</h1></main>;
  if (!user) return <main><h1>Необходимо войти в систему</h1></main>;

  return (
    <main>
      <h1>Личный кабинет</h1>
      <div className="profile-container">
        <div className="profile-info">
          <div className="profile-avatar">
            <img src={user.avatar || '/assets/lk1.jpg'} alt="Аватар" />
          </div>
          <div className="profile-details">
            {isEditing ? (
              <div className="registration">
                <p>Аватар</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files[0])}
                />
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

        <div className="export-section no-print">
          <h3>Экспорт данных</h3>
          <div className="export-buttons">
            <button onClick={() => handleExport('excel')} className="btn-export">📊 Excel</button>
            <button onClick={() => handleExport('word')} className="btn-export">📄 Word</button>
            <button onClick={() => handleExport('pdf')} className="btn-export">📕 PDF</button>
            <button onClick={handlePrint} className="btn-export">🖨️ Печать</button>
          </div>
        </div>

        <div className="reviews-section">
          <h3>Мои отзывы</h3>
          {reviews.length === 0 ? (
            <p>У вас пока нет отзывов</p>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <span className="review-author">{review.menu_item}</span>
                  <span className="review-rating">
                    {'⭐'.repeat(review.rating)}
                  </span>
                  <span className="review-date">
                    {new Date(review.created_at).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <p className="review-text">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default Profile;