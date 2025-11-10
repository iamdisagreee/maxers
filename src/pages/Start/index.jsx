import React from 'react'
import './Start.css'
import inneed from '../../assets/svg/inneed.svg'
import helper from '../../assets/svg/helper.svg'
import {Button, Input} from '@maxhub/max-ui';

export default function Start() {
  return (
    <div>
      <div className='start-text'>
        <h1 className='h1 inter-700 gradient-primary'>Здравствуйте!</h1>
        <h2 className='h4 inter-700 gradient-primary'>давайте знакомиться</h2>
      </div>
      <div className="start-cards-wrapper">
        <div className="start-card gradient-primary-bg">
          <img src={inneed} alt="Нуждающийся" className="start-card__img" />
          <h5 className="h5 inter-700 color-white">Мне нужна помощь</h5>
          <p className='p inter-500 color-white'>Вы сможете создавать просьбы: сходить в магазин, помочь по дому или сопроводить на прогулке</p>
        </div>
          <div className="start-card start-card-chosen">
          <img src={helper} alt="Волонтер" className="start-card__img" />
          <h5 className="h5 inter-700 color-white">Я готов помочь</h5>
          <p className='p inter-500 color-white'>Вы будете видеть просьбы от людей поблизости и сможете откликаться на них, совершая добрые дела</p>
        </div>
      </div>
      <div className="start-form">
        <Input mode="secondary" placeholder='Выберите ваш город'></Input>
        <Button
          size="medium"
          mode="primary"

          stretched={true}
          loading={false}
          onClick={() => alert('Кнопка нажата!')}
        >
          Вперёд
        </Button>
      </div>
    </div>
  )
}
