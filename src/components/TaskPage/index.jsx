import React, { useEffect, useState } from 'react'
import './TaskPage.css'
import TaskCategory from "../TaskCategory"
import mapPin from '../../assets/svg/map-pin.svg'
import mapPinRed from '../../assets/svg/map-pin-red.svg'
import mapPhoto from '../../assets/photos/map.png'
import Button from "../Button"
import settingsIcon from '../../assets/svg/settings.svg'
import { useTaskOpener } from '../../contexts/TaskOpenerContext'
import { getTask, updateTask } from '../../api/tasks'
import { getUser } from '../../api/users'
import { Storage } from '../../utils/storage'
import CardPageStatus from '../CardPageStatus'
import ModalList from '../ModalList'
import ModalFeedback from '../ModalFeedback'

export default function TaskPage({ taskId = null, initialTask = null }) {
  const { close } = useTaskOpener()

  const [task, setTask] = useState(initialTask)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [myProfile, setMyProfile] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  
  // Модальные окна
  const [modalType, setModalType] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)

  // contactUser — данные «чужого» участника (helper или needy), если он есть и не равен моему id
  const [contactUser, setContactUser] = useState(null)
  const [contactLoading, setContactLoading] = useState(false)

  useEffect(() => {
    // Загружаем профиль пользователя
    async function loadProfile() {
      const profile = await Storage.getProfile()
      setMyProfile(profile)
    }
    loadProfile()
  }, [])

  useEffect(() => {
    // Если есть initialTask и нет taskId — используем его и не делаем запрос
    if (!taskId && initialTask) {
      setTask(initialTask)
      // также проверим сразу, возможно initialTask содержит других участников
      checkAndFetchContact(initialTask)
      return
    }

    if (!taskId) return

    let mounted = true
    async function fetchTask() {
      setLoading(true)
      setError(null)
      setContactUser(null)

      try {
        const token = await Storage.getToken()
        const profile = await Storage.getProfile()
        const myId = profile?.id ?? null

        if (!token) {
          throw new Error('Токен авторизации не найден. Пожалуйста, войдите в аккаунт.')
        }

        const res = await getTask(taskId, token)

        if (!mounted) return
        setTask(res)

        // После получения задачи — проверяем есть ли «чужой» участник и запросим его данные
        await checkAndFetchContact(res, token, myId, mounted)
      } catch (err) {
        console.error('getTask error', err)
        if (mounted) setError(err?.response?.data?.detail || err?.message || 'Ошибка при получении задачи')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchTask()
    return () => { mounted = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId, initialTask])

  // Вынесенная функция — принимает task (можно initialTask), token и myId (если не переданы, она сама их получит)
  async function checkAndFetchContact(taskObj, tokenArg = null, myIdArg = null, mounted = true) {
    // Guard
    if (!taskObj) return

    try {
      // Если токен или myId не переданы — попытаемся получить их
      const token = tokenArg ?? await Storage.getToken()
      const profile = myIdArg ? null : await Storage.getProfile()
      const myId = myIdArg ?? (profile?.id ?? null)

      // Вычисляем чужой id: prefer helper если он чужой, иначе needy если чужой
      const helperId = taskObj.helper ?? null
      const needyId = taskObj.needy ?? null

      // Normalize: if myId is number or string, compare loosely
      const isDifferent = (id) => id !== null && id !== undefined && id !== '' && String(id) !== String(myId)

      let otherId = null
      let otherRole = null
      if (isDifferent(helperId)) {
        otherId = helperId
        otherRole = 'helper'
      } else if (isDifferent(needyId)) {
        otherId = needyId
        otherRole = 'needy'
      }

      if (!otherId) {
        // никто чужой — не запрашиваем
        return
      }

      if (!token) {
        // если нет токена — не можем запросить профиль, логим и выходим
        console.warn('Token not available — skipping getUser for contact')
        return
      }

      setContactLoading(true)
      // Запрашиваем пользователя
      const user = await getUser(otherId, token)
      if (!mounted) return

      // Нормируем имя/аватар: API возвращает firstName/lastName/username/url/activity
      const firstName = user?.firstName ?? user?.first_name ?? ''
      const lastName = user?.lastName ?? user?.last_name ?? ''
      const avatar = user
        ? (user.photo_url || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent((firstName || user.username || 'User'))}`)
        : 'https://ui-avatars.com/api/?name=user'

      // Сохраняем контакт (расширяем полями avatars/firstName/lastName для удобства)
      setContactUser({
        ...user,
        firstName,
        lastName,
        avatar,
        role: otherRole
      })
    } catch (err) {
      console.error('Error fetching contact user', err)
      // не ломаем UI — просто не показываем контакт
      setContactUser(null)
    } finally {
      setContactLoading(false)
    }
  }

  function formatRelative(isoDate) {
    if (!isoDate) return ''
    const diffMs = Date.now() - new Date(isoDate).getTime()
    const sec = Math.floor(diffMs / 1000)
    if (sec < 60) return `опубликовано ${sec} сек. назад`
    const min = Math.floor(sec / 60)
    if (min < 60) return `опубликовано ${min} мин. назад`
    const h = Math.floor(min / 60)
    if (h < 24) return `опубликовано ${h} ч. назад`
    const d = Math.floor(h / 24)
    return `опубликовано ${d} дн. назад`
  }

  // Определяем роль текущего пользователя
  const myId = myProfile?.id
  const role = myProfile?.role
  const isHelper = role === 'Helper'
  const isNeedy = role === 'Needy'

  // Fallbacks
  const categoryType = task?.category || 'Different'
  const name = task?.name || '—'
  const description = task?.description || '—'
  const city = task?.city || ''
  const address = task?.address || ''
  const createdAt = task?.createdAt || null
  const status = task?.status || ''
  const points = typeof task?.points === 'number' ? task.points : 0
  const needy = task?.needy ?? null
  const helper = task?.helper ?? null

  // Проверяем участие пользователя в задании
  const isMyTask = String(needy) === String(myId)
  const isHelperInTask = String(helper) === String(myId)
  const hasHelper = helper !== null && helper !== undefined && helper !== ''

  // Определяем, показывать ли блок с контактом
  // 1. Если я needy и нет helper - не показываем
  // 2. Если я helper и просматриваю задание - показываем needy (даже если я не принял)
  // 3. Если есть и needy и helper - показываем друг другу (только участникам)
  const isParticipant = isMyTask || isHelperInTask
  const shouldShowContact = isParticipant ? (hasHelper && contactUser) : (!isMyTask && contactUser)

  // Determine displayed user info: prefer contactUser (other person), otherwise show task's needy placeholders
  const displayAvatar = contactUser ? contactUser.avatar : (task?.needyAvatar || "https://sun9-67.userapi.com/s/v1/ig2/CY_xDesKnMtl0OiJynK0oc7QnxQVJUgeciJSi_MpZUiE3EHSCNltr76jugXaygGd2Xh0M8-61v7Jwfl1kO87YWVe.jpg")
  const displayName = contactUser ? ((contactUser.firstName || contactUser.username || `Пользователь #${contactUser.id}`) + (contactUser.lastName ? ` ${contactUser.lastName}` : '')) 
                                  : (task?.needyName || (needy ? `Пользователь #${needy}` : 'Автор'))
  const profileUrl = contactUser ? (contactUser.url || '#') : (task?.needyProfileUrl || '#')

  // Определяем, какие кнопки показывать
  const canCancelRequest = isMyTask && (status === 'Pending' || status === 'Process')
  const canReport = isHelper
  const canDecline = isHelperInTask && hasHelper

  // Показывать награду только для хелперов
  const shouldShowReward = isHelper

  // Показывать статус только для нуждающихся, которые создали задание
  const shouldShowStatus = isMyTask

  // Определяем текст и действие главной кнопки
  let mainButtonText = 'ПРИНЯТЬ ЗАДАНИЕ'
  let mainButtonAction = 'accept'
  let showMainButton = false
  let mainButtonDisabled = false

console.warn(`is mine ${isMyTask} | status ${status} | ${isHelperInTask}`)

  if (isHelper && !hasHelper && status !== 'Completed' && status !== 'Cancelled') {
    // Хелпер может принять задание, если helper пустой и задание активно
    mainButtonText = 'ПРИНЯТЬ ЗАДАНИЕ'
    mainButtonAction = 'accept'
    showMainButton = true
  } else if (isHelperInTask && status === 'Process') {
    // Хелпер в задании может завершить
    mainButtonText = 'ЗАВЕРШИТЬ ЗАДАНИЕ'
    mainButtonAction = 'complete'
    showMainButton = true
  } else if (isMyTask && (status === 'Process' || status === 'Pending')) {
    // Needy видит кнопку завершения
    mainButtonText = 'ПРОСЬБА ВЫПОЛНЕНА'
    mainButtonAction = 'complete'
    showMainButton = true
    // Disabled если нет helper
    mainButtonDisabled = !hasHelper
  }

  // Обработчики модальных окон
  const openModal = (type) => {
    setModalType(type)
  }

  const closeModal = () => {
    setModalType(null)
  }

  const closeFeedback = () => {
    setShowFeedback(false)
  }

  // Обработчик главной кнопки
  const handleMainButtonClick = async () => {
    if (!taskId || actionLoading) return

    setActionLoading(true)
    try {
      const token = await Storage.getToken()
      if (!token) {
        throw new Error('Токен авторизации не найден')
      }

      let taskData = {}

      if (mainButtonAction === 'accept') {
        // Принять задание
        taskData = {
          status: 'Process',
          helper: myId,
          rating: {
            taskPoints: null,
            reviewPoints: null,
            reasonReject: null
          }
        }
      } else if (mainButtonAction === 'complete') {
        // Завершить задание
        taskData = {
          status: 'Completed',
          helper: null,
          rating: {
            taskPoints: 5,
            reviewPoints: 1,
            reasonReject: 'Plans'
          }
        }
      }

      const updatedTask = await updateTask(taskId, taskData, token)
      
      // Обновляем задачу локально
      setTask({ ...task, ...taskData })

      // Если завершили задание - показываем модалку фидбека
      if (mainButtonAction === 'complete') {
        setShowFeedback(true)
      }

    } catch (err) {
      console.error('Error updating task:', err)
      alert(err?.response?.data?.detail || err?.message || 'Ошибка при обновлении задачи')
    } finally {
      setActionLoading(false)
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
        <div className="sheet-title gradient-primary h4 inter-700">Детали задания</div>
      </div>

      <div className="sheet-task sheet-task-page">
        {loading ? (
          <div className="sheet-loading p inter-500">Загрузка задачи...</div>
        ) : error ? (
          <div className="sheet-error p inter-500" role="alert" style={{ color: 'var(--danger,#c33)' }}>{error}</div>
        ) : (
          <>
            {shouldShowContact && (
              <a 
                href={hasHelper ? profileUrl : '#'} 
                target="_blank" 
                rel="noreferrer" 
                className={`sheet-task__user-info ${hasHelper ? 'user-info-accepted' : ''}`}
              >
                <div className="user-info-personal">
                  <img
                    className="user-info__avatar"
                    src={displayAvatar}
                    alt="Аватар"
                  />
                  <h5 className="h5 inter-500 user-info__text">{contactLoading ? 'Загрузка...' : displayName}</h5>
                </div>

                <TaskCategory className="user-info__status" type={categoryType} />

                <div className="user-info-accepted__text h5 inter-700 color-white">
                  Написать
                </div>
              </a>
            )}

            {shouldShowStatus && (
              <CardPageStatus type={status}></CardPageStatus>
            )}

            <div className="sheet-task__task-info">
              <h2 className="h2 inter-700">{name}</h2>
              <p className="p inter-500">{description}</p>
              {createdAt && <p className="p inter-500">{formatRelative(createdAt)}</p>}
            </div>

            <div className="sheet-task__task-address">
              <h4 className="h4 inter-700">Адрес</h4>
              <div className="task-address-wrapper">
                <div className="sheet-card__location">
                  <div className="card-location-text-info">
                    <img src={mapPin} alt="Местоположение" className='card-location__icon' />
                    <span className='inter-500 h6'>{city ? `${city}` : (address || '—')}</span>
                  </div>

                  <div className="address-link">
                    <img className="address-link-image" src={mapPhoto} alt="" />
                    <div className="address-link-content">
                      <img src={mapPinRed} alt="" className="address-link-svg" />
                      <span className="inter-500 h6">{address || 'Адрес не указан'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {shouldShowReward && (
              <div className="sheet-reward">
                <h4 className="h4 inter-700">Награда за выполнение</h4>
                <div className="sheet-reward-points">
                  <svg className="card-points__icon" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.07209 3.31402C5.46509 2.33352 5.66209 1.84302 6.00009 1.84302C6.33809 1.84302 6.53509 2.33302 6.92809 3.31402L6.94659 3.35902C7.16859 3.91352 7.27959 4.19052 7.50659 4.35902C7.73259 4.52702 8.03009 4.55402 8.62459 4.60702L8.73159 4.61652C9.70459 4.70352 10.1916 4.74702 10.2951 5.05652C10.3996 5.36652 10.0381 5.69502 9.31509 6.35202L9.07459 6.57202C8.70859 6.90452 8.52559 7.07102 8.44059 7.28902C8.42453 7.32976 8.41117 7.37152 8.40059 7.41402C8.34509 7.64102 8.39859 7.88252 8.50559 8.36502L8.53909 8.51502C8.73559 9.40252 8.83409 9.84602 8.66259 10.0375C8.59831 10.1089 8.51481 10.1603 8.42209 10.1855C8.17409 10.2535 7.82209 9.96652 7.11709 9.39252C6.65459 9.01552 6.42309 8.82702 6.15759 8.78452C6.05325 8.76788 5.94693 8.76788 5.84259 8.78452C5.57659 8.82702 5.34559 9.01552 4.88259 9.39252C4.17859 9.96652 3.82609 10.2535 3.57809 10.1855C3.48555 10.1602 3.40223 10.1089 3.33809 10.0375C3.16609 9.84602 3.26459 9.40252 3.46109 8.51552L3.49459 8.36502C3.60159 7.88202 3.65509 7.64102 3.59959 7.41352C3.589 7.37102 3.57564 7.32926 3.55959 7.28852C3.47459 7.07102 3.29159 6.90452 2.92559 6.57152L2.68459 6.35202C1.96209 5.69502 1.60059 5.36602 1.70459 5.05702C1.80909 4.74702 2.29559 4.70352 3.26859 4.61652L3.37559 4.60652C3.97059 4.55352 4.26759 4.52702 4.49409 4.35852C4.72059 4.19002 4.83159 3.91352 5.05409 3.35952L5.07209 3.31402Z" stroke="#A8D8B9"/>
                    <script xmlns=""/>
                  </svg>
                  <span className="sheet-reward-points-text h6">+{points} к рейтингу</span>
                </div>
              </div>
            )}

            <div className="sheet-bottom">
              {showMainButton && (
                <Button 
                  appearance="dsecondary" 
                  size="fw"
                  onClick={handleMainButtonClick}
                  disabled={actionLoading || mainButtonDisabled}
                >
                  {actionLoading ? 'Загрузка...' : mainButtonText}
                </Button>
              )}
              <div className="sheet-bottom-sbutton">
                {canDecline && (
                  <div 
                    className="sbutton-cancel inter-500 h6 accent-red" 
                    onClick={() => openModal('decline')}
                    style={{ cursor: 'pointer' }}
                  >
                    Отказаться от задания
                  </div>
                )}
                {canReport && (
                  <div 
                    className="sbutton-cancel inter-500 h6 accent-red" 
                    onClick={() => openModal('report')}
                    style={{ cursor: 'pointer' }}
                  >
                    Пожаловаться на задание
                  </div>
                )}
                {canCancelRequest && (
                  <div 
                    className="sbutton-cancel inter-500 h6 accent-red" 
                    onClick={() => openModal('cancelRequest')}
                    style={{ cursor: 'pointer' }}
                  >
                    Отменить просьбу
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {modalType && (
        <ModalList 
          type={modalType} 
          taskId={taskId}
          onClose={closeModal}
        />
      )}

      {showFeedback && (
        <ModalFeedback 
          taskId={taskId}
          onClose={closeFeedback}
        />
      )}
    </div>
  )
}