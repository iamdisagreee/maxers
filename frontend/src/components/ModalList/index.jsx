import React, { useState, useEffect } from 'react';
import './ModalList.css';
import { Storage } from '../../utils/storage';
import { createTaskReport, updateTask } from '../../api/tasks';

/**
 * ModalConfirmVariants
 *
 * props:
 * - type: 'report' | 'decline' | 'cancelRequest'
 * - initialOpen
 * - onClose(result)
 * - onSubmit(result)
 * - taskId (string)         // required for network actions
 * - taskPoints (integer|null) // optional, default null — will be placed into rating.taskPoints
 * - reasonMapOverride (object) // optional mapping of Russian option -> server code
 */
export default function ModalList({
  type = 'report',
  initialOpen = true,
  onClose,
  onSubmit,
  taskId = null,
  taskPoints = null,
  reasonMapOverride = {}
}) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successText, setSuccessText] = useState(null);

  useEffect(() => {
    if (initialOpen) {
      setIsOpen(true);
      setSelected(null);
      setError(null);
      setSuccessText(null);
    }
  }, [initialOpen]);

  if (!isOpen) return null;

  const configs = {
    report: {
      title: 'Пожаловаться на задание',
      options: ['Несоответствие категории', 'Неадекватное задание'],
      leftText: 'Назад',
      rightText: 'Отправить',
      rightStyleBehavior: 'gradient-if-selected',
    },
    decline: {
      title: 'Отказаться от задания?',
      options: ['Физически не получилось', 'Поменялись планы'],
      leftText: 'Назад',
      rightText: 'Отказаться',
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

  function close(result = null) {
    setIsOpen(false);
    if (onClose) onClose(result);
  }

  const defaultReasonMap = {
    // decline
    'Физически не получилось': 'Physical',
    'Поменялись планы': 'Plans',
    // cancelRequest
    'Не нашёлся волонтёр': 'Search',
    'Неактуально': null,
    'Волонтёр не выполнил': 'Plans'
  };


  const reasonMap = { ...defaultReasonMap, ...reasonMapOverride };

  async function handleSubmit() {
    setError(null);
    setSuccessText(null);

    if (!selected) {
      setError('Пожалуйста, выберите причину.');
      return;
    }

    if (!taskId) {
      setError('taskId не указан.');
      return;
    }

    setLoading(true);
    let mounted = true;

    try {
      const token = await Storage.getToken();
      if (!token) throw new Error('Токен для запроса не найден.');

      if (type === 'report') {
        const resp = await createTaskReport(taskId, token);
        setSuccessText(resp?.detail || 'Жалоба отправлена');
        if (onSubmit) onSubmit(resp);
        setTimeout(() => { if (mounted) close(resp); }, 600);
      } else if (type === 'decline' || type === 'cancelRequest') {
        const reasonCode = (selected in reasonMap) ? reasonMap[selected] : selected;
        const tPoints = (
          taskPoints === null || taskPoints === undefined
            ? null
            : Number.isFinite(taskPoints) ? Math.trunc(taskPoints) : null
        );

        const payload = {
          status: 'Cancelled',
          helper: null,
          rating: {
            taskPoints: tPoints,      // integer | null
            reviewPoints: null,       // integer | null
            reasonReject: reasonCode  // string | null ("Physical","Plans","Search"  null)
          }
        };

        const resp = await updateTask(taskId, payload, token);
        setSuccessText(resp?.detail || 'Операция выполнена');
        if (onSubmit) onSubmit(resp);
        setTimeout(() => { if (mounted) close(resp); }, 600);
      } else {
        throw new Error('Неизвестный тип операции');
      }
    } catch (err) {
      console.error('Modal action error:', err);
      const msg = err?.response?.data?.detail || err?.message || 'Ошибка при отправке';
      setError(msg);
    } finally {
      if (mounted) setLoading(false);
    }

    return () => { mounted = false };
  }

  const rightExtraClass =
    conf.rightStyleBehavior === 'gradient-if-selected'
      ? (selected ? 'gradient-primary-button' : 'gray-button')
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
                  disabled={loading}
                />
                <label className="list-item-label inter-400 p" htmlFor={id}>
                  {opt}
                </label>
              </div>
            );
          })}
        </div>

        {error && <div className="modal-error p inter-500" role="alert" style={{ color: '#c33', marginTop: 10 }}>{error}</div>}
        {successText && <div className="modal-success p inter-500" style={{ color: 'var(--success,#28a745)', marginTop: 10 }}>{successText}</div>}

        <div className="modal-buttons">
          <div
            className="modal-button gray-button inter-700 p"
            onClick={() => { if (!loading) close(null); }}
            style={{ pointerEvents: loading ? 'none' : 'auto', opacity: loading ? 0.6 : 1 }}
          >
            {conf.leftText}
          </div>

          <div
            className={`modal-button inter-700 p ${rightExtraClass}`}
            onClick={() => {
              if (loading) return;
              if (!selected) {
                setError('Пожалуйста, выберите причину.');
                return;
              }
              handleSubmit();
            }}
            style={{
              pointerEvents: loading ? 'none' : 'auto',
              opacity: loading ? 0.6 : 1,
              ...(conf.rightStyleBehavior === 'red' ? { fontWeight: selected ? 900 : 700 } : {})
            }}
          >
            {loading ? 'Отправка...' : conf.rightText}
          </div>
        </div>
      </div>
    </div>
  );
}
