import React from 'react'
import './TaskStatus.css'
import STATUS_MAP from './StatusConfig'

export default function TaskStatus({ type }) {
  const current = STATUS_MAP[type] || { text: 'Неизвестно', icon: null }

  return (
    <div className="task-status gradient-primary-bg">
      {current.icon && (
        <img
          src={current.icon}
          alt={current.text}
          className="task-status__icon"
        />
      )}
      <span className="task-status__title color-white inter-500 p">
        {current.text}
      </span>
    </div>
  )
}
