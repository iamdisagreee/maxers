// TaskOpenerContext.jsx
import React, { createContext, useContext, useState } from 'react';

const TaskOpenerContext = createContext();

export function TaskOpenerProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(null);

  const open = (component) => {
    setContent(component);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    // Даём время анимации закрытия перед очисткой контента
    setTimeout(() => setContent(null), 300);
  };

  return (
    <TaskOpenerContext.Provider value={{ isOpen, content, open, close }}>
      {children}
    </TaskOpenerContext.Provider>
  );
}

// Хук для использования в любом компоненте
export function useTaskOpener() {
  const context = useContext(TaskOpenerContext);
  if (!context) {
    throw new Error('useTaskOpener должен использоваться внутри TaskOpenerProvider');
  }
  return context;
}