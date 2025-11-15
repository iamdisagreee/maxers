import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BottomNav.css';
import catalog from '../../assets/svg/catalog.svg';
import profile from '../../assets/svg/profile.svg';

export default function BottomNav() {
  const [active, setActive] = useState('catalog');
  const navigate = useNavigate();

  return (
    <div className="bottom-nav">
      <div className="nav-buttons">
        <div
          className={`nav-button ${active === 'catalog' ? 'active' : ''}`}
          onClick={() => { 
            setActive('catalog'); 
            navigate('/'); 
          }}
        >
          <img src={catalog} alt="Catalog" className="icon" />
          <span className='color-white inter-400'>Каталог</span>
        </div>
        <div
          className={`nav-button ${active === 'profile' ? 'active' : ''}`}
          onClick={() => { 
            setActive('profile'); 
            navigate('/profile'); 
          }}
        >
          <img src={profile} alt="Profile" className="icon" />
          <span className='color-white inter-400'>Профиль</span>
        </div>
        {/* Шарик */}
        <div
          className="slider"
          style={{ transform: active === 'catalog' ? 'translateX(0%)' : 'translateX(100%)' }}
        ></div>
      </div>
    </div>
  );
}
