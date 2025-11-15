import React, { useEffect, useRef, useState } from 'react'
import './CategorySelect.css'
import CATEGORY_MAP from '../TaskCategory/CategoryConfig'

// TaskCategory — обновлённый, поддерживает size prop ("normal" | "small")
export function TaskCategory({ type, size = 'normal' }) {
  const current = CATEGORY_MAP[type] || { text: 'Неизвестно', icon: null }

  return (
    <div className={`task-category ${size === 'small' ? 'task-category--small' : ''} gradient-primary-bg`}>
      {current.icon && (
        <img src={current.icon} alt={current.text} className={`task-category__icon`} />
      )}
      <span className={`task-category__title color-white inter-500 p`}>
        {current.text}
      </span>
    </div>
  )
}

// CategorySelect — компонент-замена для инпута
// props:
// - value: string | null — текущий выбранный key из CATEGORY_MAP
// - onChange: fn(typeKey) — вызывается при выборе
// - placeholder: string — плейсхолдер
// Usage:
// <CategorySelect value={type} onChange={setType} />
export default function CategorySelect({ value = null, onChange = () => {}, placeholder = 'Выберите нужную категорию' }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(value)
  const rootRef = useRef(null)

  // Keep internal selected in sync if parent changes
  useEffect(() => setSelected(value), [value])

  // close on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (!rootRef.current) return
      if (!rootRef.current.contains(e.target)) setOpen(false)
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('click', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  function handleSelect(key) {
    setSelected(key)
    onChange(key)
    setOpen(false)
  }

  return (
    <div className="sheet-create-input" ref={rootRef}>
      <label className="sheet-input-label h5 inter-700">Категория</label>

      {/* Clickable control (looks like an input) */}
      <button
        type="button"
        className="sheet-input-field p inter-500 sheet-input-field--select"
        onClick={() => setOpen((s) => !s)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="sheet-input-field__content">
          {selected ? (
            // show small version of selected category
            <div className="sheet-selected-small">
              <TaskCategory type={selected} size="small" />
            </div>
          ) : (
            <span className="sheet-input-placeholder">{placeholder}</span>
          )}

          <span className="sheet-input-caret" aria-hidden>
            ▾
          </span>
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <ul className="category-dropdown" role="listbox" aria-label="Выбор категории">
          {Object.entries(CATEGORY_MAP).map(([key, { text, icon }]) => (
            <li
              key={key}
              role="option"
              aria-selected={selected === key}
              className={`category-dropdown__item ${selected === key ? 'is-selected' : ''}`}
              onClick={() => handleSelect(key)}
            >
              {/* reuse TaskCategory for consistent visuals */}
                {/* <span className="category-dropdown__text inter-500">{text}</span> */}
                <TaskCategory type={key} size="small" />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
