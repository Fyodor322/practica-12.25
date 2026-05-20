import React from 'react';

const Home = () => {
  return (
    <main>
      <div className="inscription_main">
        <h1>БОЛЬШАЯ ШИШКА<br /></h1>
        <h1>авторские коктейли & ребра</h1>
      </div>
      <hr />
      <div className="index_photo">
        <img src="/assets/main1.jpg" alt="" />
        <img src="/assets/main2.jpg" alt="" />
      </div>
      <div className="index_text">
        <b>Мы создаём своё, потому что любим город.<br />
        Авторские безалкогольные коктейли, авторская еда, уютный бар<br />
        в центре Ульяновска.</b>
      </div>
    </main>
  );
};

export default Home;