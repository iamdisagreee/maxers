import React from 'react'
import './NavBar.css'
import logo from '../../assets/svg/logo.svg'

export default function NavBar() {
return ( 
    <div>
        <div className="sheet-back-btn">
            <svg className="back-btn-svg" width="12" height="24" viewBox="0 0 12 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M3.37871 12.7109L9.03571 18.3679L10.4497 16.9539L5.49971 12.0039L10.4497 7.05389L9.03571 5.63989L3.37871 11.2969C3.19124 11.4844 3.08592 11.7387 3.08592 12.0039C3.08592 12.2691 3.19124 12.5234 3.37871 12.7109Z" fill="#222222" fillOpacity="0.8"/>
                <script xmlns=""/>
            </svg>
            <span className="back-btn-text inter-500">Назад</span>
        </div>
        <div className="sheet-top">
            <div className="sheet-title gradient-primary h4 inter-700">Детали задания</div>
        </div>
        <div className="sheet-task">
            <div className="sheet-task__user-info user-info-accepted">
                <div className="user-info-personal">
                    <img className="user-info__avatar" src="https://sun9-67.userapi.com/s/v1/ig2/CY_xDesKnMtl0OiJynK0oc7QnxQVJUgeciJSi_MpZUiE3EHSCNltr76jugXaygGd2Xh0M8-61v7Jwfl1kO87YWVe.jpg?quality=95&crop=0,0,1440,1440&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440&ava=1&u=SpmuDKJYdLKKRYYDgjLVQdEn6QnBonR3kSYxCSkCnm4&cs=200x200" alt="Аватар" />
                    <h5 className="h5 inter-500 user-info__text">Andrew Tate</h5>
                </div>
                <TaskCategory className="user-info__status" type='pill'></TaskCategory>
                <a className="user-info-accepted__text h5 inter-700 color-white" href="https://max.ru/u/f9LHodD0cOLPE3YeRIG6jx8-mQYuxVc_6ZIHjJudrMumoqaAaz5uhvzuTbE">Написать в MAX</a>
            </div>
            <div className="task-processing">
                <img src={settingsIcon} alt="" />
                <h5 className="h5 inter-700 color-white">Выполняется...</h5>
                <p className="p inter-500 color-white">Свяжитесь с Владимиром чтобы договориться о деталях </p>
            </div>
            <div className="sheet-task__task-info">
                <h2 className="h2 inter-700">Купить лекарства в аптеке</h2>
                <p className="p inter-500">Здравствуйте! Нужно купить 5 пачек Атаракса по рецепту. Рецепт я покажу при встрече. Деньги за лекарства переведу сразу на карту.</p>
                <p className="p inter-500">опубликовано 10 минут назад</p>
            </div>
            <div className="sheet-task__task-address">
                <h4 className="h4 inter-700">Адрес</h4>
                <div className="task-address-wrapper">
                    <div className="sheet-card__location">
                        <div className="card-location-text-info">
                            <img src={mapPin} alt="Местоположение" className='card-location__icon' />
                            <span className='inter-500 h6'>ул. Ньютона 9</span>
                        </div>
                        <div className="address-link">
                            <img className="address-link-image" src={mapPhoto} alt="" />
                            <div className="address-link-content">
                                <img src={mapPinRed} alt="" className="address-link-svg" />
                                <span className="inter-500 h6">ул. Ньютона 9</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="sheet-reward">
                <h4 className="h4 inter-700">Награда за выполнение</h4>
                <div className="sheet-reward-points">
                    <svg className="card-points__icon" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.07209 3.31402C5.46509 2.33352 5.66209 1.84302 6.00009 1.84302C6.33809 1.84302 6.53509 2.33302 6.92809 3.31402L6.94659 3.35902C7.16859 3.91352 7.27959 4.19052 7.50659 4.35902C7.73259 4.52702 8.03009 4.55402 8.62459 4.60702L8.73159 4.61652C9.70459 4.70352 10.1916 4.74702 10.2951 5.05652C10.3996 5.36652 10.0381 5.69502 9.31509 6.35202L9.07459 6.57202C8.70859 6.90452 8.52559 7.07102 8.44059 7.28902C8.42453 7.32976 8.41117 7.37152 8.40059 7.41402C8.34509 7.64102 8.39859 7.88252 8.50559 8.36502L8.53909 8.51502C8.73559 9.40252 8.83409 9.84602 8.66259 10.0375C8.59831 10.1089 8.51481 10.1603 8.42209 10.1855C8.17409 10.2535 7.82209 9.96652 7.11709 9.39252C6.65459 9.01552 6.42309 8.82702 6.15759 8.78452C6.05325 8.76788 5.94693 8.76788 5.84259 8.78452C5.57659 8.82702 5.34559 9.01552 4.88259 9.39252C4.17859 9.96652 3.82609 10.2535 3.57809 10.1855C3.48555 10.1602 3.40223 10.1089 3.33809 10.0375C3.16609 9.84602 3.26459 9.40252 3.46109 8.51552L3.49459 8.36502C3.60159 7.88202 3.65509 7.64102 3.59959 7.41352C3.589 7.37102 3.57564 7.32926 3.55959 7.28852C3.47459 7.07102 3.29159 6.90452 2.92559 6.57152L2.68459 6.35202C1.96209 5.69502 1.60059 5.36602 1.70459 5.05702C1.80909 4.74702 2.29559 4.70352 3.26859 4.61652L3.37559 4.60652C3.97059 4.55352 4.26759 4.52702 4.49409 4.35852C4.72059 4.19002 4.83159 3.91352 5.05409 3.35952L5.07209 3.31402Z" stroke="#A8D8B9"/>
                        <script xmlns=""/>
                    </svg>
                    <span className="sheet-reward-points-text h6">+10 к рейтингу</span>
                </div>
            </div>
            <div className="sheet-bottom">
                <Button appearance="dsecondary" size="fw">Принять задание</Button>
                <div className="sheet-bottom-sbutton">
                    {/* <div className="sbutton-report inter-500 h6 gradient-primary">Пожаловаться на задание</div> */}
                    <div className="sbutton-cancel inter-500 h6 accent-red">Отказаться от задания</div>
                </div>
            </div>
        </div>
    </div>
)}