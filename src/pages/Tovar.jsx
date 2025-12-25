import React from 'react';

const Tovar = () => {
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

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <main>
      <div className="tovar_img">
        <img src="/assets/bludo2.webp" alt="СЕТ ИЗ КОЛБАСОК К ПИВУ" />
      </div>
      <h1>СЕТ ИЗ КОЛБАСОК К ПИВУ</h1>
      <h4>Куриные колбаски, свино-говяжьи, охотничьи колбаски с соусами на выбор (410гр.)</h4>
      <h3>1100</h3>
      <button>Заказать</button>
      
      <div className="reviews-section">
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
    </main>
  );
};

export default Tovar;