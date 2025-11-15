import React, { useState } from 'react';
import './ModalInput.css';
import Input from '../Input';
import { updateUser } from '../../api/users'; 
import { Storage } from '../../utils/storage';

export default function ModalInput() {
  const [isOpen, setIsOpen] = useState(true); 
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const token = await Storage.getToken();
      const profile = await Storage.getProfile();
      const userId = profile?.id;

      if (!token || !userId) {
        console.error('Нет токена или ID пользователя');
        return;
      }

      const updatedUser = await updateUser(userId, { city }, token);
      console.log('Город обновлён:', updatedUser);

      setIsOpen(false);
    } catch (err) {
      console.error('Ошибка обновления города:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-bg">
      <div className="modal-wrapper">
        <span className="modal-text inter-500 h6">Хотите изменить город?</span>

        <Input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Введите новый город"
        />

        <div className="modal-buttons">
          <div
            className="modal-button modal-cancel inter-700 p"
            onClick={() => setIsOpen(false)}
          >
            Отмена
          </div>

          <div
            className="modal-button modal-confirm inter-700 p"
            onClick={handleConfirm}
            style={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto' }}
          >
            {loading ? 'Сохраняем...' : 'Подтвердить'}
          </div>
        </div>
      </div>
    </div>
  );
}
