import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import accessibilityIcon from '../../assets/svg/accessibility.svg';
import handIcon from '../../assets/svg/hand.svg';
import calendarIcon from '../../assets/svg/calendar.svg';
import star2Icon from '../../assets/svg/star2.svg';
import TaskCard from '../../components/TaskCard';
import heartIcon from '../../assets/svg/heart.svg';
import repair2Icon from '../../assets/svg/repair2.svg';
import tenIcon from '../../assets/svg/10.svg';
import './User.css';
import { getUser } from '../../api/users';
import { getAllTasks } from '../../api/tasks';
import ModalInput from '../../components/ModalInput'
import { useTaskOpener } from '../../contexts/TaskOpenerContext';
import Rating from '../../components/Rating';

export default function User({ profile, role, token }) {
  const { id: urlId } = useParams();     
  const userId = urlId || profile?.id;  
  const isHelper = role === 'Helper';
  const isNeedy = role === 'Needy';

  const [userData, setUserData] = useState(null);

  // состояния для задач
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState(null);
  const { open } = useTaskOpener();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  // загрузка профиля
  useEffect(() => {
    if (!userId || !token) return;

    let mounted = true;
    const fetchUser = async () => {
      try {
        setLoadingUser(true);
        const data = await getUser(userId, token);
        if (!mounted) return;
        setUserData(data);
      } catch (err) {
        console.error("Ошибка загрузки профиля:", err);
      } finally {
        if (mounted) setLoadingUser(false);
      }
    };

    fetchUser();
    return () => { mounted = false; };
  }, [userId, token]);

  useEffect(() => {
    if (!role || !token) return;

    let mounted = true;
    const fetchTasks = async () => {
      setTasksLoading(true);
      setTasksError(null);

      try {
        const typeList = isHelper ? 'user' : 'pending';
        const data = await getAllTasks(token, 1, typeList);
        if (!mounted) return;

        const list = Array.isArray(data) ? data : (data?.results || data?.items || []);
        setTasks(list);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        if (mounted) setTasksError('Не удалось загрузить задачи');
      } finally {
        if (mounted) setTasksLoading(false);
      }
    };

    fetchTasks();
    return () => { mounted = false; };
  }, [role, token, isHelper]);

  const handleClick = () => {
    if (isHelper){
    open(
      <Rating
        onComplete={() => {
          console.log("задача выполнена!");
        }}
      />
    );
    }
  };
  

  if (loadingUser) return <div className="user">Загрузка профиля...</div>;
  if (!userData) return <div className="user">Профиль не найден</div>;

  const { firstName, lastName, url, createdAt, activity } = userData;
  const avatar = userData
    ? (userData.photo_url || userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent((firstName || userData.username || 'User'))}`)
    : ('https://via.placeholder.com/48?text=U');

  const monthsTogether = Math.max(
    1,
    Math.floor((Date.now() - new Date(createdAt)) / (1000 * 60 * 60 * 24 * 30))
  );

  const renderEmptyState = () => (
    <div className="tasks-empty p inter-500">Здесь пока нет задач</div>
  );

  return (
    <div className='user'>
      <div className="user-personal">
        <div className="user-avatar-wrapper">
          <img
            className="user-avatar"
            src={avatar}
            alt="Аватар"
          />
        </div>

        <div className="user-personal-right">
          <div className="user-personal-name inter-700 h2">
            {firstName} {lastName}
          </div>

          <div className="user-personal-status gradient-primary-bg">
            <img src={accessibilityIcon} alt="" />
            <span className="inter-500 color-white h6">Начинающий</span>
          </div>
        </div>
      </div>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon">
              <img className="stat-card-icon-svg" src={calendarIcon} alt="" />
            </div>
            <div className="stat-card-text inter-700 h4">{monthsTogether} мес</div>
          </div>
          <div className="stat-card-description inter-500 p">вместе с "Рядом"</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon">
              <img className="stat-card-icon-svg" src={handIcon} alt="" />
            </div>
            <div className="stat-card-text inter-700 h4">{activity?.completedTasks ?? 0}</div>
          </div>
          <div className="stat-card-description inter-500 p">{isHelper ? 'выполенных дел' : isNeedy ? 'завершенных просьбы' : 'закрытых задач'}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon">
              <img className="stat-card-icon-svg" src={star2Icon} alt="" />
            </div>
            <div className="stat-card-text inter-700 h4">{activity?.rating ?? 0}</div>
          </div>
          <div onClick={handleClick} className="stat-card-description stat-card-rating inter-500 p">{isHelper ? 'рейтинг волонтёра' : isNeedy ? 'рейтинг доверия' : 'рейтинг'}{isHelper && (
            <svg width="12" height="24" viewBox="0 0 12 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M10.1569 12.7109L4.49994 18.3679L3.08594 16.9539L8.03594 12.0039L3.08594 7.05389L4.49994 5.63989L10.1569 11.2969C10.3444 11.4844 10.4497 11.7387 10.4497 12.0039C10.4497 12.2691 10.3444 12.5234 10.1569 12.7109Z" fill="black"/>
              <script xmlns=""/>
            </svg>
          )}</div>
        </div>
      </div>

      <div>
        <h3 className="h3 inter-700">Моя информация</h3>
        <div className="city-info">
          <span className="p inter-600">{userData.city}</span>
          <div className="city-info-edit" onClick={() => setIsModalOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.33333 12.6667H4.28333L10.8 6.15L9.85 5.2L3.33333 11.7167V12.6667ZM2 14V11.1667L10.8 2.38333C10.9333 2.26111 11.0807 2.16667 11.242 2.1C11.4033 2.03333 11.5727 2 11.75 2C11.9273 2 12.0996 2.03333 12.2667 2.1C12.4338 2.16667 12.5782 2.26667 12.7 2.4L13.6167 3.33333C13.75 3.45556 13.8473 3.6 13.9087 3.76667C13.97 3.93333 14.0004 4.1 14 4.26667C14 4.44444 13.9696 4.614 13.9087 4.77533C13.8478 4.93667 13.7504 5.08378 13.6167 5.21667L4.83333 14H2ZM10.3167 5.68333L9.85 5.2L10.8 6.15L10.3167 5.68333Z" fill="url(#paint0_linear_327_794)"/>
              <defs>
              <linearGradient id="paint0_linear_327_794" x1="2" y1="8" x2="14" y2="8" gradientUnits="userSpaceOnUse">
              <stop stop-color="#8EA9E8"/>
              <stop offset="1" stop-color="#505F82"/>
              </linearGradient>
              </defs>
              <script xmlns=""/>
            </svg>
            <span className="gradient-primary inter-700 p">Редактировать</span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ModalInput
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isHelper && (
        <div>
          <h3 className="h3 inter-700">Мои достижения</h3>
          <div className="achievements">
            <div className="achievement">
              <div className="achievement-logo">
                <img src={heartIcon} alt="" className="achievment-logo-svg" />
              </div>
              <div className="achievement-text inter-700">Доброе сердце</div>
            </div>

            <div className="achievement achievement-inactive">
              <div className="achievement-logo">
                <img src={tenIcon} alt="" className="achievment-logo-svg" />
              </div>
              <div className="achievement-text inter-700">Помочь 10 людям</div>
            </div>

            <div className="achievement achievement-inactive">
              <div className="achievement-logo">
                <img src={repair2Icon} alt="" className="achievment-logo-svg" />
              </div>
              <div className="achievement-text inter-700">На все руки мастер</div>
            </div>
          </div>
        </div>
      )}

      <div>
        <div>
          <h3 className="h3 inter-700">{isHelper ? 'Мои добрые дела' : isNeedy ? 'Мои актуальные просьбы' : 'Задачи'}</h3>
          <div className="goods-wrapper">
            {tasksLoading && <div className="tasks-loading">Загрузка...</div>}

            {!tasksLoading && tasksError && (
              <div className="tasks-error">{tasksError}</div>
            )}

            {!tasksLoading && !tasksError && tasks.length === 0 && renderEmptyState()}

            {!tasksLoading && !tasksError && tasks.length > 0 && tasks.map(task => (
              <TaskCard key={task.id} task={task} type={role} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
