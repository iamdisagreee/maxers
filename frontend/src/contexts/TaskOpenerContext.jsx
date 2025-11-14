import React, { createContext, useContext, useState } from 'react';

const TaskOpenerContext = createContext();

export const TaskOpenerProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(null);

  const openTaskOpener = (component) => {
    setContent(component);
    setIsOpen(true);
  };

  const closeTaskOpener = () => {
    setIsOpen(false);
    // Задержка перед очисткой контента для плавной анимации закрытия
    setTimeout(() => setContent(null), 300);
  };

  return (
    <TaskOpenerContext.Provider value={{ isOpen, content, openTaskOpener, closeTaskOpener }}>
      {children}
    </TaskOpenerContext.Provider>
  );
};

export const useTaskOpener = () => {
  const context = useContext(TaskOpenerContext);
  if (!context) {
    throw new Error('useTaskOpener должен использоваться внутри TaskOpenerProvider');
  }
  return context;
};