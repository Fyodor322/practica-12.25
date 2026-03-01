import React, { useState, useEffect } from 'react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // Обновление каждые 30 сек
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/notifications/', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки уведомлений:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/notifications/${id}/read/`, {
        method: 'POST',
        credentials: 'include',
      });
      loadNotifications();
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="notifications-widget">
      <button 
        className="notification-bell" 
        onClick={() => setShow(!show)}
      >
        🔔 {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {show && (
        <div className="notifications-dropdown">
          <h4>Уведомления</h4>
          {notifications.length === 0 ? (
            <p>Нет уведомлений</p>
          ) : (
            notifications.map(notif => (
              <div 
                key={notif.id} 
                className={`notification-item ${!notif.is_read ? 'unread' : ''}`}
                onClick={() => markAsRead(notif.id)}
              >
                <strong>{notif.title}</strong>
                <p>{notif.message}</p>
                <small>{new Date(notif.created_at).toLocaleString('ru-RU')}</small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
