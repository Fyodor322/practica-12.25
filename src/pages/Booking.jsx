import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Booking = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    location: 'Ульяновский 32',
    table: ''
  });
  const [success, setSuccess] = useState(false);
  const [bookedTables, setBookedTables] = useState([1, 5, 8]); // Пример забронированных столиков
  const navigate = useNavigate();

  const tables = {
    'Ульяновский 32': [
      { id: 1, seats: 2, zone: 'У окна' },
      { id: 2, seats: 4, zone: 'У окна' },
      { id: 3, seats: 2, zone: 'Центр' },
      { id: 4, seats: 4, zone: 'Центр' },
      { id: 5, seats: 6, zone: 'Центр' },
      { id: 6, seats: 2, zone: 'Бар' },
      { id: 7, seats: 4, zone: 'Веранда' },
      { id: 8, seats: 8, zone: 'VIP' },
    ],
    'Тюленева 50': [
      { id: 1, seats: 2, zone: 'У окна' },
      { id: 2, seats: 2, zone: 'У окна' },
      { id: 3, seats: 4, zone: 'Центр' },
      { id: 4, seats: 4, zone: 'Центр' },
      { id: 5, seats: 6, zone: 'Центр' },
      { id: 6, seats: 2, zone: 'Бар' },
      { id: 7, seats: 2, zone: 'Бар' },
    ],
    'Авиастроителей 7A': [
      { id: 1, seats: 2, zone: 'У окна' },
      { id: 2, seats: 4, zone: 'У окна' },
      { id: 3, seats: 2, zone: 'Центр' },
      { id: 4, seats: 4, zone: 'Центр' },
      { id: 5, seats: 6, zone: 'Центр' },
      { id: 6, seats: 8, zone: 'VIP' },
    ],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      ...(name === 'location' && { table: '' }) // Сброс столика при смене заведения
    });
  };

  const handleTableSelect = (tableId) => {
    if (!bookedTables.includes(tableId)) {
      setFormData({ ...formData, table: tableId });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.table) {
      alert('Пожалуйста, выберите столик');
      return;
    }
    console.log('Бронирование:', formData);
    setSuccess(true);
    setTimeout(() => {
      navigate('/menu');
    }, 2000);
  };

  const currentTables = tables[formData.location] || [];

  return (
    <main>
      <h1>Бронирование столика</h1>
      <div className="booking-container">
        <form className="registration" onSubmit={handleSubmit}>
          {success && <p style={{color: '#E7DC00', textAlign: 'center'}}>✓ Бронирование успешно оформлено!</p>}
          
          <p>Имя</p>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          
          <p>Телефон</p>
          <input 
            type="tel" 
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+7-XXX-XXX-XX-XX"
            required
          />
          
          <p>Дата</p>
          <input 
            type="date" 
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            required
          />
          
          <p>Время</p>
          <input 
            type="time" 
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
          
          <p>Количество гостей</p>
          <select 
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            style={{
              width: '100%',
              border: '2px solid rgba(231, 220, 0, 0.3)',
              backgroundColor: 'rgba(231, 220, 0, 0.1)',
              height: '50px',
              padding: '5px 15px',
              boxSizing: 'border-box',
              borderRadius: '10px',
              color: '#E7DC00',
              fontSize: '16px'
            }}
          >
            {[1,2,3,4,5,6,7,8,9,10].map(num => (
              <option key={num} value={num}>{num} {num === 1 ? 'гость' : num < 5 ? 'гостя' : 'гостей'}</option>
            ))}
          </select>
          
          <p>Адрес ресторана</p>
          <select 
            name="location"
            value={formData.location}
            onChange={handleChange}
            style={{
              width: '100%',
              border: '2px solid rgba(231, 220, 0, 0.3)',
              backgroundColor: 'rgba(231, 220, 0, 0.1)',
              height: '50px',
              padding: '5px 15px',
              boxSizing: 'border-box',
              borderRadius: '10px',
              color: '#E7DC00',
              fontSize: '16px'
            }}
          >
            <option value="Ульяновский 32">Ульяновский 32</option>
            <option value="Тюленева 50">Тюленева 50</option>
            <option value="Авиастроителей 7A">Авиастроителей 7A</option>
          </select>
          
          <p>Выберите столик {formData.table && `(Столик №${formData.table})`}</p>
          <div className="table-map">
            {currentTables.map(table => (
              <div
                key={table.id}
                className={`table-item ${
                  bookedTables.includes(table.id) ? 'booked' : 
                  formData.table === table.id ? 'selected' : 'available'
                }`}
                onClick={() => handleTableSelect(table.id)}
              >
                <div className="table-number">№{table.id}</div>
                <div className="table-info">{table.seats} мест</div>
                <div className="table-zone">{table.zone}</div>
              </div>
            ))}
          </div>
          
          <div style={{marginTop: '20px', fontSize: '14px', color: '#E7DC00', textAlign: 'center'}}>
            <span style={{color: '#4CAF50'}}>■</span> Доступен
            <span style={{marginLeft: '15px', color: '#E7DC00'}}>■</span> Выбран
            <span style={{marginLeft: '15px', color: '#666'}}>■</span> Занят
          </div>
          
          <button type="submit" className="registButton">Забронировать</button>
        </form>
      </div>
    </main>
  );
};

export default Booking;