import React from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {
  const handleExport = async (format) => {
    try {
      const response = await fetch(`http://localhost:8000/api/export/menu/${format}/`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Ошибка экспорта');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `menu.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Ошибка при экспорте: ' + error.message);
    }
  };

  return (
    <main>
      <h1>Меню</h1>
      
      <div className="export-buttons no-print">
        <button onClick={() => handleExport('excel')} className="btn-export">📊 Скачать Excel</button>
        <button onClick={() => window.print()} className="btn-export">🖨️ Печать</button>
      </div>
      <h2>Кухня</h2>
      <hr />
      <div className="menu_kitchen">
        <Link className="kart_tovar" to="/tovar">
          <img src="/assets/bludo2.webp" alt="" />
          <p className="name_tovar">СЕТ ИЗ КОЛБАСОК</p>
          <p className="disc_tover">Куриные колбаски, свино-говяжьи, охотничьи колбаски с соусами на выбор (410гр.)</p>
          <p className="price_tovar">1100</p>
        </Link>
        <Link className="kart_tovar" to="/tovar">
          <img src="/assets/bludo2.webp" alt="" />
          <p className="name_tovar">СЕТ ИЗ КОЛБАСОК</p>
          <p className="disc_tover">Куриные колбаски, свино-говяжьи, охотничьи колбаски с соусами на выбор (410гр.)</p>
          <p className="price_tovar">1100</p>
        </Link>
        <Link className="kart_tovar" to="/tovar">
          <img src="/assets/bludo2.webp" alt="" />
          <p className="name_tovar">СЕТ ИЗ КОЛБАСОК</p>
          <p className="disc_tover">Куриные колбаски, свино-говяжьи, охотничьи колбаски с соусами на выбор (410гр.)</p>
          <p className="price_tovar">1100</p>
        </Link>
      </div>
      <h2>Бар</h2>
      <hr />
      <div className="menu_bar">
        <Link className="kart_tovar" to="/tovar">
          <img src="/assets/bludo3.jpg" alt="" />
          <p className="name_tovar">ПЕРВЫЙ ШАГ Б/А</p>
          <p className="disc_tover">Безалкогольный лагер янтарно-золотистого цвета с лёгкой хмелевой горчинкой (0.5л)</p>
          <p className="price_tovar">350</p>
        </Link>
        <Link className="kart_tovar" to="/tovar">
          <img src="/assets/bludo3.jpg" alt="" />
          <p className="name_tovar">ПЕРВЫЙ ШАГ Б/А</p>
          <p className="disc_tover">Безалкогольный лагер янтарно-золотистого цвета с лёгкой хмелевой горчинкой (0.5л)</p>
          <p className="price_tovar">350</p>
        </Link>
        <Link className="kart_tovar" to="/tovar">
          <img src="/assets/bludo3.jpg" alt="" />
          <p className="name_tovar">ПЕРВЫЙ ШАГ Б/А</p>
          <p className="disc_tover">Безалкогольный лагер янтарно-золотистого цвета с лёгкой хмелевой горчинкой (0.5л)</p>
          <p className="price_tovar">350</p>
        </Link>
      </div>
    </main>
  );
};

export default Menu;