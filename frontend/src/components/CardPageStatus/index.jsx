import React from 'react'
import './CardPageStatus.css'
import STATUS_MAP from '../TaskStatus/StatusConfig'

export default function CardPageStatus({ type }) {
  const current = STATUS_MAP[type] || { text: 'Неизвестно', icon: null }

  return (
    <div className={`task-processing ${current.class}`}>
      {current.icon && (
        <img
          src={current.icon}
          alt={current.text}
          className="task-status__icon-big"
        />
      )}
      <h5 className="h5 inter-700 color-white">{current.text}</h5>
      <p className="p inter-500 color-white">
        {current.description}
      </p>
    </div>
  )
}
