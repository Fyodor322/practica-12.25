import React from 'react';

const Home = () => {
  return (
    <main>
      <div className="inscription_main">
        <h1>БОЛЬШАЯ ШИШКА<br /></h1>
        <h1>крафт & ребра</h1>
      </div>
      <hr />
      <div className="index_photo">
        <img src="/assets/main1.jpg" alt="" />
        <img src="/assets/main2.jpg" alt="" />
      </div>
      <div className="index_text">
        <b>Мы варим своё, потому что любим город.<br />
        Крафт, авторская еда, уютный бар<br />
        в центре Ульяновска.</b>
      </div>
    </main>
  );
};

export default Home;