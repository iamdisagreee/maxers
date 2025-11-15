import React, { useState } from 'react';
import './ModalConfirm.css';

export default function ModalConfirm2() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="modal-bg">
      <div className="modal-wrapper">
        <span className="modal-text inter-500 h6">Проверьте, всё ли верно?</span>
        <span className="modal-description inter-400">После подтверждения вы будете зарегистрированы как «<span className="inter-600">Волонтер</span>», и <span className="inter-600">изменить эту роль будет нельзя</span></span>
        <div className="modal-buttons">
          <div
            className="modal-button modal-cancel inter-700 p"
            onClick={() => setIsOpen(false)}
          >
            Отмена
          </div>
          <div
            className="modal-button modal-confirm inter-700 p"
            onClick={() => {
              console.log('Подтверждено!');
              setIsOpen(false);
            }}
          >
            Подтвердить
          </div>
        </div>
      </div>
    </div>
  );
}
