import React, { useState } from 'react';
import './ModalList.css';

export default function ModalConfirmVariants({
  type = 'report',         // 'report' | 'decline' | 'cancelRequest'
  initialOpen = true,
  onClose,
  onSubmit,
}) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [selected, setSelected] = useState(null);

  if (!isOpen) return null;

  const configs = {
    report: {
      title: 'Пожаловаться на задание',
      options: ['Несоответствие категории', 'Неадекватное задание'],
      leftText: 'Назад',
      rightText: 'Отправить',
      // right button: gray by default, becomes gradient when option selected
      rightStyleBehavior: 'gradient-if-selected',
    },
    decline: {
      title: 'Отказаться от задания?',
      options: ['Физически не получилось', 'Поменялись планы'],
      leftText: 'Назад',
      rightText: 'Отказаться',
      // right button: always red; text becomes bolder when option selected (inline style)
      rightStyleBehavior: 'red',
    },
    cancelRequest: {
      title: 'Отменить просьбу?',
      options: ['Не нашёлся волонтёр', 'Неактуально', 'Волонтёр не выполнил'],
      leftText: 'Назад',
      rightText: 'Отказаться',
      rightStyleBehavior: 'red',
    },
  };

  const conf = configs[type] || configs.report;

  function close(result) {
    setIsOpen(false);
    if (onClose) onClose(result);
  }

  function submit() {
    if (onSubmit) onSubmit(selected);
    setIsOpen(false);
  }

  // compute extra class for right button — but **preserve** original base class names
  const rightExtraClass =
    conf.rightStyleBehavior === 'gradient-if-selected'
      ? (selected ? 'gradient-primary-button' : 'gray-button') // you asked to use these classnames
      : conf.rightStyleBehavior === 'red'
      ? 'red-button'
      : '';

  return (
    <div className="modal-bg">
      <div className="modal-wrapper">
        <span className="modal-text inter-500 h6">{conf.title}</span>

        <div className="list-wrapper">
          {conf.options.map((opt, idx) => {
            const id = `opt-${type}-${idx}`;
            return (
              <div className="list-item" key={id}>
                <input
                  className="list-item-input"
                  type="radio"
                  name={`list-${type}`}
                  id={id}
                  value={opt}
                  checked={selected === opt}
                  onChange={() => setSelected(opt)}
                />
                <label className="list-item-label inter-400 p" htmlFor={id}>
                  {opt}
                </label>
              </div>
            );
          })}
        </div>

        <div className="modal-buttons">
          <div
            className="modal-button gray-button inter-700 p"
            onClick={() => close(null)}
          >
            {conf.leftText}
          </div>

          <div
            className={`modal-button inter-700 p ${rightExtraClass}`}
            onClick={() => {
              // require selection before submitting (keeps current behavior)
              if (!selected) return;
              submit();
            }}
            // inline bolding for red-button variants as requested:
            style={conf.rightStyleBehavior === 'red' ? { fontWeight: selected ? 900 : 700 } : undefined}
          >
            {conf.rightText}
          </div>
        </div>
      </div>
    </div>
  );
}
