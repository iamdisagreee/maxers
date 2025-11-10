import React from 'react'
import NavBar from './components/NavBar'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Catalog'
import Start from './pages/Start'
import User from './pages/User'
import BottomNav from './components/BottomNav'
import './App.css'

export default function App() {
    const location = useLocation()
  
  // Массив путей, где хотим показывать BottomNav
  const showBottomNavPaths = ['/', 'catalog']

  const shouldShowBottomNav = showBottomNavPaths.includes(location.pathname)
  return (
    <div className='app-container'>
      <div className="header">
        <NavBar />
      </div>
      <main className='content-wrapper'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/start" element={<Start />} />
          <Route path="/user/:id" element={<User />} />
        </Routes>
      </main>
      {shouldShowBottomNav && <BottomNav />}
    </div>
  )
}
