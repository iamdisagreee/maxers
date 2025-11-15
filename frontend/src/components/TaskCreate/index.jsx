import React, { useState } from 'react'
import './TaskCreate.css'
import TaskCategory from "../TaskCategory"
import CategorySelect from '../CategorySelect'
import Button from "../Button"
import { useTaskOpener } from '../../contexts/TaskOpenerContext'
import { addTask } from '../../api/tasks' // <- путь к API, поправь если по-другому

export default function TaskCreate() {
  const { close } = useTaskOpener()

  // форма
  const [category, setCategory] = useState(null) // string key из CATEGORY_MAP, например "Different"
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // валидация: все поля обязательны
  const isFormValid = category && name.trim() && description.trim() && city.trim() && address.trim()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isFormValid || loading) return

    setLoading(true)
    setError(null)

    // Получение токена — пример: localStorage. Если у вас другой источник,
    // замените на useSelector/useContext и т.д.
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken')

    if (!token) {
      setLoading(false)
      setError('Не найден токен авторизации. Войдите в аккаунт.')
      return
    }

    const payload = {
      category: category, // строка, как в CATEGORY_MAP (например "Different")
      name: name.trim(),
      description: description.trim(),
      city: city.trim(),
      address: address.trim()
    }

    try {
      await addTask(payload, token)
      // при успешном создании — закрываем окно/лист
      close()
    } catch (err) {
      console.error('addTask error', err)
      // Постарайся получить текст ошибки
      const message = err?.response?.data?.detail || err?.message || 'Ошибка при создании просьбы'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="sheet-back-btn">
        <svg className="back-btn-svg" width="12" height="24" viewBox="0 0 12 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M3.37871 12.7109L9.03571 18.3679L10.4497 16.9539L5.49971 12.0039L10.4497 7.05389L9.03571 5.63989L3.37871 11.2969C3.19124 11.4844 3.08592 11.7387 3.08592 12.0039C3.08592 12.2691 3.19124 12.5234 3.37871 12.7109Z" fill="#222222" fillOpacity="0.8"/>
          <script xmlns=""/>
        </svg>
        <span onClick={close} className="back-btn-text inter-500">Назад</span>
      </div>

      <div className="sheet-top">
        <div className="sheet-title gradient-primary h4 inter-700">Новая просьба</div>
      </div>

      <form className="sheet-create" onSubmit={handleSubmit}>
        <CategorySelect value={category} onChange={setCategory} placeholder="Выберите нужную категорию" />

        <div className="sheet-create-input">
          <label className="sheet-input-label h5 inter-700">Название</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            className="sheet-input-field p inter-500"
            placeholder="Например: Купить хлеб и молоко"
          />
        </div>

        <div className="sheet-create-input">
          <label className="sheet-input-label h5 inter-700">Описание</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="sheet-input-field sheet-textarea-field p inter-500"
            placeholder="Опишите детали: что именно нужно сделать, есть ли особые пожелания."
          />
        </div>

        <div className="sheet-create-input">
          <label className="sheet-input-label h5 inter-700">Город</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            type="text"
            className="sheet-input-field p inter-500"
            placeholder="Например: Москва"
          />
        </div>

        <div className="sheet-create-input">
          <label className="sheet-input-label h5 inter-700">Адрес</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            type="text"
            className="sheet-input-field p inter-500"
            placeholder="Сообщите об адресе, по которому нужна помощь (номер дома и квартиры)"
          />
        </div>

        {error && <div className="sheet-error p inter-500" role="alert" style={{ color: 'var(--danger, #c33)', marginTop: 8 }}>{error}</div>}

        <div className="sheet-bottom" style={{ marginTop: 12 }}>
          <Button type="submit" appearance="dsecondary" size="fw" disabled={!isFormValid || loading}>
            {loading ? 'СОЗДАЁМ...' : 'СОЗДАТЬ ПРОСЬБУ'}
          </Button>
        </div>
      </form>
    </div>
  )
}
