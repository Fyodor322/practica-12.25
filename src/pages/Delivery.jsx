import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Delivery = () => {
  const [cart, setCart] = useState([]);
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: '',
    phone: '',
    address: '',
    comment: ''
  });
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Загружаем меню из API
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/menu/');
        if (response.ok) {
          const data = await response.json();
          setMenuItems(data);
        }
      } catch (error) {
        console.error('Ошибка загрузки меню:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Загружаем корзину из localStorage при загрузке
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Сохраняем корзину в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      alert('Корзина пуста! Добавьте блюда в корзину.');
      return;
    }

    if (!deliveryInfo.name || !deliveryInfo.phone || !deliveryInfo.address) {
      alert('Пожалуйста, заполните все обязательные поля.');
      return;
    }

    const orderData = {
      items: cart.map(item => ({
        menu_item: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      delivery_info: deliveryInfo,
      total_price: getTotalPrice()
    };

    try {
      const response = await fetch('http://localhost:8000/api/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        setOrderSuccess(true);
        clearCart();
        setDeliveryInfo({
          name: '',
          phone: '',
          address: '',
          comment: ''
        });
        
        // Скрываем сообщение об успехе через 5 секунд
        setTimeout(() => {
          setOrderSuccess(false);
        }, 5000);
      } else {
        alert('Ошибка при оформлении заказа. Попробуйте еще раз.');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка соединения с сервером.');
    }
  };

  return (
    <main>
      <h2>Доставка</h2>
      
      {orderSuccess && (
        <div className="success-message">
          <p>Заказ успешно оформлен! Мы свяжемся с вами для подтверждения.</p>
        </div>
      )}

      <div className="delivery-container">
        {/* Основное окно корзины */}
        <div className="cart-main-section">
          <div className="cart-main-container">
            <h3>Корзина</h3>
            
            {cart.length === 0 ? (
              <p className="empty-cart">Корзина пуста. Добавьте блюда из меню ниже.</p>
            ) : (
              <>
                <div className="cart-items-main">
                  {cart.map(item => (
                    <div key={item.id} className="cart-item-main">
                      <div className="cart-item-info-main">
                        <h4>{item.name}</h4>
                        <p className="cart-item-description">{item.description}</p>
                        <div className="cart-item-price-info">
                          <span className="cart-item-price">{item.price} ₽</span>
                          <span className="cart-item-quantity">× {item.quantity}</span>
                          <span className="cart-item-total">= {item.price * item.quantity} ₽</span>
                        </div>
                      </div>
                      <div className="cart-item-controls-main">
                        <div className="quantity-controls">
                          <button 
                            className="quantity-btn-main"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="quantity-main">{item.quantity}</span>
                          <button 
                            className="quantity-btn-main"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <button 
                          className="remove-btn-main"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="cart-total-main">
                  <div className="total-info">
                    <h4>Итого: {getTotalPrice()} ₽</h4>
                    <p className="total-items">Товаров: {cart.reduce((total, item) => total + item.quantity, 0)} шт.</p>
                  </div>
                  <div className="cart-actions">
                    <button 
                      className="clear-cart-btn-main"
                      onClick={clearCart}
                    >
                      Очистить корзину
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Форма для заполнения данных гостя */}
          <div className="guest-form-container">
            <h3>Данные для доставки</h3>
            <form className="guest-form" onSubmit={handleSubmitOrder}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name" className="required">Имя</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={deliveryInfo.name}
                    onChange={handleDeliveryChange}
                    required
                    placeholder="Введите ваше имя"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="required">Телефон</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={deliveryInfo.phone}
                    onChange={handleDeliveryChange}
                    required
                    placeholder="+7 (XXX) XXX-XX-XX"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address" className="required">Адрес доставки</label>
                <textarea
                  id="address"
                  name="address"
                  value={deliveryInfo.address}
                  onChange={handleDeliveryChange}
                  required
                  placeholder="Улица, дом, квартира, подъезд, этаж, код домофона"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="comment">Комментарий к заказу</label>
                <textarea
                  id="comment"
                  name="comment"
                  value={deliveryInfo.comment}
                  onChange={handleDeliveryChange}
                  placeholder="Особые пожелания, время доставки, отсутствие лифта и т.д."
                  rows="3"
                />
              </div>

              <div className="form-submit">
                <button 
                  type="submit" 
                  className="submit-order-btn-main"
                  disabled={cart.length === 0}
                >
                  Оформить заказ на {getTotalPrice()} ₽
                </button>
                <p className="form-note">* Обязательные поля для заполнения</p>
              </div>
            </form>
          </div>
        </div>

        {/* Секция меню */}
        <div className="menu-section">
          {loading ? (
            <p>Загрузка меню...</p>
          ) : (
            <div className="menu-items">
              {menuItems.map(item => (
                <div key={item.id} className="menu-item">
                  <div className="menu-item-content">
                    <div className="menu-item-left">
                      <div className="menu-item-image">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <div className="menu-item-right">
                      <div className="menu-item-info">
                        <h4>{item.name}</h4>
                        <p className="menu-item-description">{item.description}</p>
                        <div className="menu-item-footer">
                          <span className="menu-item-price">{item.price} ₽</span>
                          <button 
                            className="add-to-cart-btn"
                            onClick={() => addToCart(item)}
                          >
                            Добавить в корзину
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Отзывы о блюде */}
                  <div className="menu-item-reviews">
                    <div className="review-stats">
                      <span className="rating">★★★★★</span>
                      <span className="review-count">(12 отзывов)</span>
                    </div>
                    <div className="review-excerpt">
                      "Очень вкусно! Обязательно закажу ещё раз." - <em>Анна</em>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Delivery;