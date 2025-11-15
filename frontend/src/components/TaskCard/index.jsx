// src/components/TaskCard/index.jsx
import React, { useEffect, useState } from 'react'
import './TaskCard.css'
import { CellList, CellHeader, CellSimple, Avatar } from '@maxhub/max-ui';
import { useTaskOpener } from '../../contexts/TaskOpenerContext';
import TaskPage from '../TaskPage';
import TaskCategory from '../TaskCategory'
import TaskStatus from '../TaskStatus'
import mapPin from '../../assets/svg/map-pin.svg'
import personIcon from '../../assets/svg/person.svg'
import PillIcon from '../../assets/svg/pill.svg?react';
import { getUser } from '../../api/users' 
import { Storage } from '../../utils/storage'

/**
 * TaskCard
 * props:
 *  - task: объект задачи (обязательный)
 *  - type: роль текущего пользователя: "Helper" | "Needy" (опционально, влияет на вид)
 */
export default function TaskCard({ task, type = 'Helper' }) {
  if (!task) {
    return null;
  }

  const { open } = useTaskOpener();
  const isHelperView = type === 'Helper';
  const isNeedyView = type === 'Needy';

  const [needyUser, setNeedyUser] = useState(null)
  const [needyLoading, setNeedyLoading] = useState(false)

  useEffect(() => {
    let mounted = true

    async function fetchNeedy() {
      if (!task?.needy) return

      setNeedyLoading(true)
      try {
        const token = (await Storage.getToken()) || window.localStorage.getItem('accessToken') || window.localStorage.getItem('token')

        if (!token) {
          console.warn('Token not found — skipping getUser request')
          setNeedyLoading(false)
          return
        }

        const user = await getUser(task.needy, token)
        if (!mounted) return
        setNeedyUser(user)
      } catch (err) {
        console.error('Failed to fetch needy user', err)
        if (mounted) setNeedyUser(null)
      } finally {
        if (mounted) setNeedyLoading(false)
      }
    }

    fetchNeedy()
    return () => { mounted = false }
  }, [task?.needy])

  const handleClick = () => {
    open(
      <TaskPage
        taskId={task.id}
        initialTask={task}
        onComplete={() => {
          console.log("задача выполнена!");
        }}
      />
    );
  };


  const id = task.id || "id";
  const title = task.name || 'Без названия';
  const categoryRaw = task.category || '';

  const categoryKey = categoryRaw || 'Different';
  const city = task.city || '';
  const address = task.address || '';
  const locationText = city ? `${city}${address ? ', ' + address : ''}` : (address || 'местоположение не указано');
  const createdAt = task.createdAt ? new Date(task.createdAt) : null;
  const finishedAt = task.finishedAt ? new Date(task.finishedAt) : null;
  const points = typeof task.points === 'number' ? task.points : null;
  const status = task.status || 'pending';

  function timeAgo(date) {
    if (!date) return '';
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}с`;
    if (diff < 3600) return `${Math.floor(diff / 60)}м`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}ч`;
    return `${Math.floor(diff / 86400)}д`;
  }


  const needyLabel = needyUser
    ? (needyUser.firstName || needyUser.username || `user#${needyUser.id}`)
    : (task.needy_name || (task.needy ? `user#${task.needy}` : null));

  const needyAvatar = needyUser
    ? (needyUser.photo_url || needyUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent((needyUser.firstName || needyUser.username || 'User'))}`)
    : (task.needy_photo || 'https://ui-avatars.com/api/?name=user');

  return (
    <div className={`task-card ${isHelperView ? 'helper' : 'needy'}`} onClick={handleClick} role="button" tabIndex={0}>
      {/* helper view */}
      {isHelperView && (
        <>
          <div className="task-card-top">
            <div className="task-card__user-info">
              <div className="task-card__photo-name">
                <img
                  className="user-info__avatar"
                  src={needyAvatar}
                  alt={needyLabel || 'Аватар'}
                />
                <h5 className="h5 inter-500">{needyLoading ? 'Загрузка...' : (needyLabel || 'Нуждающийся')}</h5>
              </div>

              {/* категория */}
              <TaskCategory type={categoryKey}></TaskCategory>
            </div>
          </div>

          <div className="task-card-center">
            <div className="task-card__title inter-700 h4">{title}</div>

            <div className="task-card__location">
              <img src={mapPin} alt="Местоположение" className='card-location__icon' />
              <span className='inter-500 h6'>{locationText}</span>
            </div>
          </div>

          <div className="task-card-bottom">
            <div className="task-card__date inter-400 h6">
              {createdAt ? `опубликовано ${timeAgo(createdAt)} назад` : 'время не указано'}
            </div>
          </div>

          {points !== null && (
            <div className="task-card__points">
              <svg className="card-points__icon" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.07209 3.31402C5.46509 2.33352 5.66209 1.84302 6.00009 1.84302C6.33809 1.84302 6.53509 2.33302 6.92809 3.31402L6.94659 3.35902C7.16859 3.91352 7.27959 4.19052 7.50659 4.35902C7.73259 4.52702 8.03009 4.55402 8.62459 4.60702L8.73159 4.61652C9.70459 4.70352 10.1916 4.74702 10.2951 5.05652C10.3996 5.36652 10.0381 5.69502 9.31509 6.35202L9.07459 6.57202C8.70859 6.90452 8.52559 7.07102 8.44059 7.28902C8.42453 7.32976 8.41117 7.37152 8.40059 7.41402C8.34509 7.64102 8.39859 7.88252 8.50559 8.36502L8.53909 8.51502C8.73559 9.40252 8.83409 9.84602 8.66259 10.0375C8.59831 10.1089 8.51481 10.1603 8.42209 10.1855C8.17409 10.2535 7.82209 9.96652 7.11709 9.39252C6.65459 9.01552 6.42309 8.82702 6.15759 8.78452C6.05325 8.76788 5.94693 8.76788 5.84259 8.78452C5.57659 8.82702 5.34559 9.01552 4.88259 9.39252C4.17859 9.96652 3.82609 10.2535 3.57809 10.1855C3.48555 10.1602 3.40223 10.1089 3.33809 10.0375C3.16609 9.84602 3.26459 9.40252 3.46109 8.51552L3.49459 8.36502C3.60159 7.88202 3.65509 7.64102 3.59959 7.41352C3.589 7.37102 3.57564 7.32926 3.55959 7.28852C3.47459 7.07102 3.29159 6.90452 2.92559 6.57152L2.68459 6.35202C1.96209 5.69502 1.60059 5.36602 1.70459 5.05702C1.80909 4.74702 2.29559 4.70352 3.26859 4.61652L3.37559 4.60652C3.97059 4.55352 4.26759 4.52702 4.49409 4.35852C4.72059 4.19002 4.83159 3.91352 5.05409 3.35952L5.07209 3.31402Z" stroke="#A8D8B9"/>
              </svg>
              <span className="card-points__value inter-500 p">+{points}</span>
            </div>
          )}
        </>
      )}

      {/* needy view */}
      {isNeedyView && (
        <>
          <div className="task-card-top">
            <TaskStatus type={status}></TaskStatus>
          </div>

          <div className="task-card-center">
            <div className="task-card__title inter-700 h4">{title}</div>

            <div className="task-card__location">
              <img src={personIcon} alt="Исполнитель" className='card-location__icon' />
              <span className='inter-500 h6'>
                {task.helper_name || (task.helper ? `волонтёр: ${task.helper}` : 'волонтёр: не назначен')}
              </span>
            </div>
          </div>

          <div className="task-card-bottom">
            <div className="task-card__date inter-400 h6">
              {createdAt ? `создано ${timeAgo(createdAt)} назад` : 'время не указано'}
            </div>
          </div>

          <div className='task-card-category-big'>
            {/* крупная иконка категории */}
            <PillIcon className="task-category__big-icon" style={{ fill: 'var(--dprimary)' }} />
          </div>
        </>
      )}
    </div>
  )
}
