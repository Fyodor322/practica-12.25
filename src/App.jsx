import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Menu from './pages/Menu.jsx';
import SignIn from './pages/SignIn.jsx';
import Registration from './pages/Registration.jsx';
import Profile from './pages/Profile.jsx';
import Tovar from './pages/Tovar.jsx';
import Booking from './pages/Booking.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tovar" element={<Tovar />} />
          <Route path="/booking" element={<Booking />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;