import React, { useState } from 'react';
import './ModalConfirm.css';

export default function ModalConfirm2() {
  const [isOpen, setIsOpen] = useState(true); // модалка изначально открыта

  if (!isOpen) return null; // если закрыта — не рендерим

  return (
    <div className="modal-bg">
      <div className="modal-wrapper">
        <span className="modal-text inter-500 h6">Уверены в своём выборе?</span>
        <div className="modal-buttons">
          <div
            className="modal-button modal-cancel inter-700 p"
            onClick={() => setIsOpen(false)} // закрываем модалку
          >
            Отмена
          </div>
          <div
            className="modal-button modal-confirm inter-700 p"
            onClick={() => {
              // сюда можно добавить действие подтверждения
              console.log('Подтверждено!');
              setIsOpen(false); // тоже закрываем модалку после подтверждения
            }}
          >
            Подтвердить
          </div>
        </div>
      </div>
    </div>
  );
}
