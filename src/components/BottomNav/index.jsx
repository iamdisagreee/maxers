import React from 'react'
import './BottomNav.css'
import catalog from '../../assets/svg/catalog.svg'
import profile from '../../assets/svg/profile.svg'
import {Button, ToolButton} from '@maxhub/max-ui';


export default function NavBar() {
  return (
    <div className="bottom-nav">
      {/* <ToolButton appearance="default">      </ToolButton> */}
        <Button size='large' mode='primary' appearance='themed' stretched='true' iconBefore={<img src={catalog} alt="Каталог" style={{ width: 20, height: 20 }} />}>Каталог</Button>
        <Button size='large' mode='primary' appearance='neutral-themed' stretched='true' iconBefore={<img src={profile} alt="Профиль" style={{ width: 20, height: 20 }} />}>Профиль</Button>
        {/* <div className="bottom-nav__button primary-bg">
            <img src={catalog} alt="Каталог" className="bottom-nav__button__icon"/>
            <div className="bottom-nav__button__text inter-500 color-white">Каталог</div>
        </div>
        <div className="bottom-nav__button primary-bg">
            <img src={catalog} alt="Каталог" className="bottom-nav__button__icon"/>
            <div className="bottom-nav__button__text inter-500 color-white">Каталог</div>
        </div> */}
    </div>
  )
}
