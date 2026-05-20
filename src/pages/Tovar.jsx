import React, { useState, useEffect } from 'react';

const Tovar = () => {
  const [cart, setCart] = useState([]);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const reviews = [
    {
      id: 1,
      author: 'Алексей М.',
      rating: 5,
      date: '15.12.2023',
      text: 'Отличный сет! Колбаски очень вкусные, особенно охотничьи. Соусы прекрасно дополняют блюдо.'
    },
    {
      id: 2,
      author: 'Мария К.',
      rating: 4,
      date: '12.12.2023',
      text: 'Хорошее блюдо для компании. Порция большая, наедаемся втроем. Рекомендую к пиву.'
    },
    {
      id: 3,
      author: 'Дмитрий П.',
      rating: 5,
      date: '08.12.2023',
      text: 'Заказываю уже не первый раз. Качество всегда на высоте, колбаски сочные и ароматные.'
    }
  ];

  // Данные текущего товара
  const currentItem = {
    id: 1,
    name: 'СЕТ ИЗ КОЛБАСОК К ПИВУ',
    description: 'Куриные колбаски, свино-говяжьи, охотничьи колбаски с соусами на выбор (410гр.)',
    price: 1100,
    image: '/assets/bludo2.webp',
    weight: '410 г',
    category: 'Закуски',
    rating: 4.8
  };

  // Загружаем корзину из localStorage при загрузке
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCart(parsedCart);
      
      // Проверяем, есть ли текущий товар в корзине
      const isInCart = parsedCart.some(item => item.id === currentItem.id);
      setAddedToCart(isInCart);
    }
  }, []);

  // Сохраняем корзину в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const addToCart = () => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === currentItem.id);
      
      if (existingItem) {
        // Если товар уже в корзине, увеличиваем количество
        return prevCart.map(item =>
          item.id === currentItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Если товара нет в корзине, добавляем его
        return [...prevCart, { ...currentItem, quantity: 1 }];
      }
    });
    
    setAddedToCart(true);
    
    // Показываем сообщение об успешном добавлении
    const message = document.createElement('div');
    message.className = 'cart-success-message';
    message.textContent = 'Товар добавлен в корзину!';
    document.body.appendChild(message);
    
    // Убираем сообщение через 3 секунды
    setTimeout(() => {
      message.remove();
    }, 3000);
  };

  const removeFromCart = () => {
    setCart(prevCart => prevCart.filter(item => item.id !== currentItem.id));
    setAddedToCart(false);
  };

  return (
    <main>
      <div className="tovar-container">
        <div className="tovar-content">
          {/* Фото слева */}
          <div className="tovar-left">
            <div className="tovar_img">
              <img src="/assets/bludo2.webp" alt="СЕТ ИЗ КОЛБАСОК К ПИВУ" />
            </div>
          </div>
          
          {/* Информация справа */}
          <div className="tovar-right">
            <div className="tovar-info">
              <h1>СЕТ ИЗ КОЛБАСОК К ПИВУ</h1>
              <h4>Куриные колбаски, свино-говяжьи, охотничьи колбаски с соусами на выбор (410гр.)</h4>
              
              <div className="tovar-details">
                <div className="detail-item">
                  <span className="detail-label">Вес:</span>
                  <span className="detail-value">410 г</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Категория:</span>
                  <span className="detail-value">Закуски</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Рейтинг:</span>
                  <span className="detail-value rating-stars">★★★★★ (4.8)</span>
                </div>
              </div>
              
              <div className="tovar-price-section">
                <h3>1100 ₽</h3>
                <div className="cart-buttons">
                  {addedToCart ? (
                    <>
                      <button 
                        className="tovar-order-btn added-to-cart"
                        onClick={removeFromCart}
                      >
                        Удалить из корзины
                      </button>
                      <button 
                        className="tovar-order-btn secondary"
                        onClick={addToCart}
                      >
                        Добавить ещё
                      </button>
                    </>
                  ) : (
                    <button 
                      className="tovar-order-btn"
                      onClick={addToCart}
                    >
                      Добавить в корзину
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Отзывы внизу */}
        <div className="tovar-reviews">
          <h2>Отзывы</h2>
          <hr />
          {reviews.map(review => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <span className="review-author">{review.author}</span>
                <span className="review-rating">{renderStars(review.rating)}</span>
                <span className="review-date">{review.date}</span>
              </div>
              <p className="review-text">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Tovar;