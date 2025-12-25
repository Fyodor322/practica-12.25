import React from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {
  return (
    <main>
      <h1>Меню</h1>
      <h2>Кухня</h2>
      <hr />
      <div className="menu_kitchen">
        <Link className="kart_tovar" to="/tovar">
          <img src="/assets/bludo2.webp" alt="" />
          <p className="name_tovar">СЕТ ИЗ КОЛБАСОК К ПИВУ</p>
          <p className="disc_tover">Куриные колбаски, свино-говяжьи, охотничьи колбаски с соусами на выбор (410гр.)</p>
          <p className="price_tovar">1100</p>
        </Link>
        <Link className="kart_tovar" to="/tovar">
          <img src="/assets/bludo2.webp" alt="" />
          <p className="name_tovar">СЕТ ИЗ КОЛБАСОК К ПИВУ</p>
          <p className="disc_tover">Куриные колбаски, свино-говяжьи, охотничьи колбаски с соусами на выбор (410гр.)</p>
          <p className="price_tovar">1100</p>
        </Link>
        <Link className="kart_tovar" to="/tovar">
          <img src="/assets/bludo2.webp" alt="" />
          <p className="name_tovar">СЕТ ИЗ КОЛБАСОК К ПИВУ</p>
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