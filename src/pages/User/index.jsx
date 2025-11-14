import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import accessibilityIcon from '../../assets/svg/accessibility.svg';
import handIcon from '../../assets/svg/hand.svg';
import calendarIcon from '../../assets/svg/calendar.svg';
import star2Icon from '../../assets/svg/star2.svg';
import TaskCard from '../../components/TaskCard';
import heartIcon from '../../assets/svg/heart.svg';
import repair2Icon from '../../assets/svg/repair2.svg';
import tenIcon from '../../assets/svg/10.svg';
import './User.css'

export default function User({ profile, role, token }) {
  const { id } = useParams(); // id пользователя из URL
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // например, загрузка данных пользователя через API
    const fetchUser = async () => {
      try {
        console.log('Token для запросов:', token);
        console.log('Текущий профиль:', profile);
        console.log('Роль:', role);
        console.log('ID из URL:', id);

        // тут можно вызвать API, например:
        // const data = await getUser(id);
        // setUserData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [id, profile, role, token]);


  return (
    <div className='user'>
      <div className="user-personal">
        <div className="user-avatar-wrapper">
          <img className="user-avatar" src="https://sun9-67.userapi.com/s/v1/ig2/CY_xDesKnMtl0OiJynK0oc7QnxQVJUgeciJSi_MpZUiE3EHSCNltr76jugXaygGd2Xh0M8-61v7Jwfl1kO87YWVe.jpg?quality=95&crop=0,0,1440,1440&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440&ava=1&u=SpmuDKJYdLKKRYYDgjLVQdEn6QnBonR3kSYxCSkCnm4&cs=200x200" alt="Аватар" />
        </div>
        <div className="user-personal-right">
          <div className="user-personal-name inter-700 h2">Владимир  {id}</div>
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
            <div className="stat-card-text inter-700 h4">8 мес </div>
          </div>
          <div className="stat-card-description inter-500 p">вместе c "Рядом"</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon">
              <img className="stat-card-icon-svg" src={handIcon} alt="" />
            </div>
            <div className="stat-card-text inter-700 h4">44</div>
          </div>
          <div className="stat-card-description inter-500 p">выполненных дел</div>
        </div>
                <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon">
              <img className="stat-card-icon-svg" src={star2Icon} alt="" />
            </div>
            <div className="stat-card-text inter-700 h4">212</div>
          </div>
          <div className="stat-card-description inter-500 p">рейтинг волонтёра</div>
        </div>
      </div>
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
        <div>
          <h3 className="h3 inter-700">Мои добрые дела</h3>
          <div className="goods-wrapper">
            <TaskCard type="helper"></TaskCard>
            <TaskCard type="helper"></TaskCard>
            <TaskCard type="helper"></TaskCard>
          </div>
        </div>
      </div>
    </div>
  )
}