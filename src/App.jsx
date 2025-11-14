// App.jsx
import React, { useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Catalog';
import Start from './pages/Start';
import User from './pages/User';
import BottomNav from './components/BottomNav';
import { Storage } from './utils/storage';
import { TaskOpenerProvider, useTaskOpener } from './contexts/TaskOpenerContext';
import TaskOpener from './components/TaskOpener';
import './App.css';

// Защищённый маршрут
function ProtectedRoute({ children, storageReady, token }) {
  if (!storageReady) return <div>Loading...</div>;
  return token ? children : <Navigate to="/start" replace />;
}

// Внутренний компонент с роутами
function AppContent({ storageReady, token, role, profile, handleAuthSet }) {
  const location = useLocation();
  const { isOpen, content, close } = useTaskOpener();
  
  const showBottomNavPaths = ['/', '/catalog', '/profile'];
  const shouldShowBottomNav = showBottomNavPaths.includes(location.pathname);

  return (
    <div className='app-container'>
      <div className="header">
        <NavBar />
      </div>
      <main className='content-wrapper'>
        <Routes>
          <Route 
            path="/" 
            element={
              <ProtectedRoute storageReady={storageReady} token={token}>
                <Home profile={profile} role={role} token={token} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/start" 
            element={
              <Start profile={profile} token={token} onAuthSet={handleAuthSet} />
            } 
          />
          <Route 
            path="/user/:id" 
            element={
              <ProtectedRoute storageReady={storageReady} token={token}>
                <User profile={profile} role={role} token={token} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute storageReady={storageReady} token={token}>
                <User profile={profile} role={role} token={token} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="*" 
            element={
              <Start profile={profile} token={token} onAuthSet={handleAuthSet} />
            } 
          />
        </Routes>
      </main>
      {shouldShowBottomNav && <BottomNav />}
      
      {/* Глобальная открывашка */}
      <TaskOpener isOpen={isOpen} onClose={close}>
        {content}
      </TaskOpener>
    </div>
  );
}

export default function App() {
  const [storageReady, setStorageReady] = useState(false);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);

  const handleAuthSet = async (newToken, newRole) => {
    setToken(newToken);
    setRole(newRole);
    await Storage.setToken(newToken);
    await Storage.setRole(newRole);
  };

  useEffect(() => {
    const init = async () => {
      try {
        await Storage.init();
        let t = await Storage.getToken();
        let r = await Storage.getRole(); 
        t = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3OTg1NDEzMCIsInJvbGUiOiJOZWVkeSIsImNpdHkiOiJcdTA0MmZcdTA0NDBcdTA0M2VcdTA0NDFcdTA0M2JcdTA0MzBcdTA0MzJcdTA0M2JcdTA0NGMifQ.395L_-OOsPBYkEKuDOwQzTZ3x_F99KQKASS1MGB0Y0E"
        r = "Needy"
        const p = await Storage.getProfile();
        setRole(r);
        setToken(t);
        setProfile(p);
      } catch (err) {
        console.error('Storage init error:', err);
      } finally {
        setStorageReady(true);
      }
    };
    init();
  }, []);

  return (
    <TaskOpenerProvider>
      <AppContent 
        storageReady={storageReady}
        token={token}
        role={role}
        profile={profile}
        handleAuthSet={handleAuthSet}
      />
    </TaskOpenerProvider>
  );
}