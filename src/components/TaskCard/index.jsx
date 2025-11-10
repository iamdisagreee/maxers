import React from 'react'
import './TaskCard.css'
import { CellList, CellHeader, CellSimple, Avatar } from '@maxhub/max-ui';
import TaskStatus from '../TaskStatus';
import mapPin from '../../assets/svg/map-pin.svg'
import star from '../../assets/svg/star.svg'


export default function TaskCard() {
  return (
    <div className="task-card">
        <div className="task-card-top">
            <div className="task-card__user-info">
                <CellSimple
                    before={<Avatar.Container size={40}><Avatar.Image src="https://sun9-67.userapi.com/s/v1/ig2/CY_xDesKnMtl0OiJynK0oc7QnxQVJUgeciJSi_MpZUiE3EHSCNltr76jugXaygGd2Xh0M8-61v7Jwfl1kO87YWVe.jpg?quality=95&crop=0,0,1440,1440&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440&ava=1&u=SpmuDKJYdLKKRYYDgjLVQdEn6QnBonR3kSYxCSkCnm4&cs=200x200" /></Avatar.Container>}
                    onClick={() => {}}
                    title="Vadim Tregubenko"
                />
                <TaskStatus type='pill'></TaskStatus>
            </div>
        </div>
        <div className="task-card-center">
            <div className="task-card__title inter-700 h4">Купить лекарства в аптеке</div>
            <div className="task-card__location">
                <img src={mapPin} alt="Местоположение" className='card-location__icon' />
                <span className='inter-500 h6'>ул. Ньютона 9 (~800 м от вас) </span>
            </div>
        </div>
        <div className="task-card-bottom">
            <div className="task-card__date inter-500 h6">опубликовано 10 минут назад</div>
        </div>
        <div className="task-card__points">
            <img src={star} alt="Звезда" className="card-points__icon" />
            <span className="card-points__value inter-500">+10</span>
        </div>
    </div>
  )
}
