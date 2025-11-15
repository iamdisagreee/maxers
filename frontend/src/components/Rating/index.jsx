import React, { useEffect, useState } from 'react'
import './Rating.css'
import { useTaskOpener } from '../../contexts/TaskOpenerContext'
import { getAllUsers } from '../../api/users'
import { Storage } from '../../utils/storage'
import firstIcon from '../../assets/svg/1.svg'
import secondIcon from '../../assets/svg/2.svg'
import thirdIcon from '../../assets/svg/3.svg'

export default function Rating({ profile }) {
  const { close } = useTaskOpener()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [myRank, setMyRank] = useState(null)
  const [rawResp, setRawResp] = useState(null)

  useEffect(() => {
    let mounted = true

    async function fetchUsers() {
      setLoading(true)
      setError(null)
      try {
        const token = await Storage.getToken()
        if (!token) throw new Error('token not found')

        const raw = await getAllUsers(token)
        console.log('getAllUsers raw response:', raw)
        if (!mounted) return
        setRawResp(raw)

        // normalize list: raw may be { users: [...] } or array or { results: [...] }
        let list = []
        if (Array.isArray(raw)) {
          list = raw
        } else if (Array.isArray(raw?.users)) {
          list = raw.users
        } else if (Array.isArray(raw?.results)) {
          list = raw.results
        } else if (Array.isArray(raw?.items)) {
          list = raw.items
        } else {
          list = []
        }

        // Map and normalize each user
        const mapped = list.map(u => {
          // accept snake_case and camelCase
          const firstName = u?.first_name ?? u?.firstName ?? ''
          const lastName = u?.last_name ?? u?.lastName ?? ''
          const username = u?.username ?? u?.login ?? ''
          const id = u?.id ?? null
          const city = u?.city ?? ''
          const url = u?.url ?? ''
          const activity = u?.activity ?? {}
          // activity rating may be activity.rating (camel) or activity?.rating (snake too in your sample)
          const rating = activity?.rating ?? activity?.rating ?? 0
          // completed tasks may be snake or camel
          const completedTasks = activity?.completed_tasks ?? activity?.completedTasks ?? 0

          // choose score: prefer rating, then completedTasks
          const score = Number(rating ?? completedTasks ?? 0) || 0

          const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName || username || 'User')}`

          return {
            raw: u,
            id,
            firstName,
            lastName,
            username,
            city,
            url,
            score,
            avatar,
            activity: {
              rating,
              completedTasks
            }
          }
        })

        // sort by score desc
        mapped.sort((a, b) => b.score - a.score)

        setUsers(mapped)

        // Determine my rank:
        // prefer server-provided raw.current.place if present
        const current = raw?.current ?? null
        if (current?.place != null) {
          setMyRank(Number(current.place))
        } else {
          const myId = profile?.id ?? null
          if (myId != null) {
            const idx = mapped.findIndex(item => String(item.id) === String(myId))
            setMyRank(idx >= 0 ? idx + 1 : null)
          } else {
            setMyRank(null)
          }
        }
      } catch (err) {
        console.error('Failed to load users for rating', err)
        if (mounted) setError(err?.message || 'Ошибка загрузки рейтинга')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchUsers()
    return () => { mounted = false }
  }, [profile])

  const renderTopItem = (user, place) => {
    const icon = place === 1 ? firstIcon : place === 2 ? secondIcon : thirdIcon
    return (
      <li key={user.id ?? `top-${place}`} className={`rating-place rating-place-${place === 1 ? 'first' : place === 2 ? 'second' : 'third'}`}>
          <div className="rating-place__icon">
            <img src={icon} alt={`place-${place}`} className="rating-icon" />
          </div>
          <div className="rating-place__person">
            {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user.username || `#${user.id}`)}
          </div>
          <span className="rating-place__points">{user.score} баллов</span>
      </li>
    )
  }

  const renderListItem = (user, index) => (
    <li key={user.id ?? index} className={`rating-place rating-place-regular ${String(user.id) === String(profile?.id) ? 'is-me' : ''}`}>
      <span className="rating-place__number">{index + 1}</span>
      <img src={user.avatar} alt="" className="rating-place__avatar" />
      <span className="rating-place__person">{user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user.username || `#${user.id}`)}</span>
      <span className="rating-place__points">{user.score} баллов</span>
    </li>
  )

  const me = users.find(u => String(u.id) === String(profile?.id))

  return (
    <div className="rating-page">
      <div className="sheet-back-btn">
        <svg className="back-btn-svg" width="12" height="24" viewBox="0 0 12 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M3.37871 12.7109L9.03571 18.3679L10.4497 16.9539L5.49971 12.0039L10.4497 7.05389L9.03571 5.63989L3.37871 11.2969C3.19124 11.4844 3.08592 11.7387 3.08592 12.0039C3.08592 12.2691 3.19124 12.5234 3.37871 12.7109Z" fill="#222222" fillOpacity="0.8"/>
        </svg>
        <span onClick={close} className="back-btn-text inter-500">Назад</span>
      </div>

      <div className="sheet-top">
        <div className="sheet-title gradient-primary h4 inter-700">Рейтинг волонтёров</div>
      </div>

      <div className="rating-content">
        {loading && <div className="rating-loading">Загрузка рейтинга...</div>}
        {error && <div className="rating-error">{error}</div>}

        {!loading && !error && (
          <>
            <div className="rating-card">
              {users[0] ? (
                <div className="rating-card-top">
                  <img src={users[0].avatar} alt="" className="rating-card__avatar" />
                  <div className="rating-card__info">
                    <h2 className="h2 inter-700">{users[0].firstName ? `${users[0].firstName} ${users[0].lastName}`.trim() : (users[0].username || `#${users[0].id}`)}</h2>
                    <h4 className="h4 inter-600">Место: 1 · Баллы: {users[0].score}</h4>
                  </div>
                </div>
              ) : (
                <div className="rating-card-empty">Нет участников</div>
              )}
            </div>

            <div className="leaderboard-wrapper">
              <h3 className="h3 inter-700">Список лидеров</h3>
              <ul className="rating-leaderboard">
                {users.slice(0, 3).map((u, i) => renderTopItem(u, i + 1))}
                {users.length > 3 && <li className="rating-separator">…</li>}
                {users.slice(3).map((u, i) => renderListItem(u, i + 4))}
              </ul>

              {myRank && myRank > 3 && me && (
                <div className="my-rank">
                  <span className="my-rank__label">Моё место</span>
                  <div className="my-rank__card">
                    <span className="my-rank__number">{myRank}</span>
                    <img src={me.avatar} alt="" className="my-rank__avatar" />
                    <div className="my-rank__info">
                      <div className="my-rank__name">{me.firstName ? `${me.firstName} ${me.lastName || ''}`.trim() : (me.username || `#${me.id}`)}</div>
                      <div className="my-rank__points">{me.score} баллов</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </>
        )}
      </div>
    </div>
  )
}
