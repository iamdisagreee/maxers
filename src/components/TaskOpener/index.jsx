import React, { useState, useRef, useEffect } from "react";
import TaskCategory from "../TaskCategory"
import mapPin from '../../assets/svg/map-pin.svg'
import mapPinRed from '../../assets/svg/map-pin-red.svg'
import mapPhoto from '../../assets/photos/map.png'
import Button from "../Button"
import "./TaskOpener.css";

export default function TaskOpener({ isOpen, onClose, children, maxHeight = 600 }) {
  const sheetRef = useRef(null);
  const startYRef = useRef(0);
  const lastTranslateRef = useRef(0);
  const [translate, setTranslate] = useState(100);
  const [dragging, setDragging] = useState(false);

  // открытие/закрытие—анимация
  useEffect(() => {
    if (isOpen) {
      setTranslate(0);
    } else {
      setTranslate(100);
    }
  }, [isOpen]);

  // закрыть по ESC
  useEffect(() => {
    const onKey = (e) => { 
      if (e.key === "Escape") onClose?.(); 
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // helper: перевод пикселей свайпа в проценты по высоте листа
  const pxToPercent = (px) => {
    const height = sheetRef.current?.clientHeight || maxHeight;
    return (px / height) * 100;
  };

  // pointer/touch start
  const handlePointerDown = (clientY) => {
    startYRef.current = clientY;
    lastTranslateRef.current = translate;
    setDragging(true);
  };

  const handlePointerMove = (clientY) => {
    if (!dragging) return;
    const dy = clientY - startYRef.current;
    const percent = pxToPercent(dy);
    const newTranslate = Math.max(0, lastTranslateRef.current + percent);
    setTranslate(newTranslate);
  };

  const handlePointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    
    if (translate > 20) {
      onClose?.();
    } else {
      setTranslate(0);
    }
  };

  const onPointerDown = (e) => {
    e.stopPropagation();
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    handlePointerDown(clientY);
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    handlePointerMove(clientY);
  };

  const onPointerUp = () => handlePointerUp();

  // Обработка скролла - закрытие при скролле вниз
  useEffect(() => {
    if (!isOpen) return;

    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Если скроллим вниз (currentScrollY > lastScrollY)
      if (currentScrollY > lastScrollY) {
        onClose?.();
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* backdrop */}
      <div
        className={`task-opener-backdrop ${isOpen || dragging ? "visible" : ""}`}
        onClick={() => onClose?.()}
        style={{ pointerEvents: isOpen || dragging ? "auto" : "none" }}
      />
      
      {/* sheet */}
      <div
        ref={sheetRef}
        className={`task-opener-sheet ${isOpen ? "open" : ""} ${dragging ? "dragging" : ""}`}
        style={{
          transform: `translate(-50%, ${translate}%)`,
          transition: dragging ? "none" : "transform 300ms cubic-bezier(.22,.9,.32,1)"
        }}
        onTouchStart={onPointerDown}
        onTouchMove={onPointerMove}
        onTouchEnd={onPointerUp}
        onMouseDown={onPointerDown}
        onMouseMove={onPointerMove}
        onMouseUp={onPointerUp}
        onMouseLeave={() => dragging && handlePointerUp()}
      >
        <div className="sheet-handle" />
        <div className="sheet-content">
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
                <div className="sheet-task__user-info">
                    <div className="user-info-personal">
                        <img className="user-info__avatar" src="https://sun9-67.userapi.com/s/v1/ig2/CY_xDesKnMtl0OiJynK0oc7QnxQVJUgeciJSi_MpZUiE3EHSCNltr76jugXaygGd2Xh0M8-61v7Jwfl1kO87YWVe.jpg?quality=95&crop=0,0,1440,1440&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440&ava=1&u=SpmuDKJYdLKKRYYDgjLVQdEn6QnBonR3kSYxCSkCnm4&cs=200x200" alt="Аватар" />
                        <h5 className="h5 inter-500">Andrew Tate</h5>
                    </div>
                    <TaskCategory type='pill'></TaskCategory>
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
                </div>
                <div className="sheet-bottom">
                    <Button appearance="dsecondary" size="large">Принять задание</Button>
                </div>
            </div>
        </div>
      </div>
    </>
  );
}