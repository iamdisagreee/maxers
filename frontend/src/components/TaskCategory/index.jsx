import React from 'react'
import './TaskCategory.css'
import CATEGORY_MAP from './CategoryConfig'

export default function TaskCategory({ type }) {
  const current = CATEGORY_MAP[type] || { text: 'Неизвестно', icon: null }

  return (
    <div className="task-category gradient-primary-bg">
      {current.icon && (
        <img
          src={current.icon}
          alt={current.text}
          className="task-category__icon"
        />
      )}
      <span className="task-category__title color-white inter-500 p">
        {current.text}
      </span>
    </div>
  )
}
