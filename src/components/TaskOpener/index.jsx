import React, { useState, useRef, useEffect } from "react";
import TaskCategory from "../TaskCategory"
import mapPin from '../../assets/svg/map-pin.svg'
import mapPinRed from '../../assets/svg/map-pin-red.svg'
import mapPhoto from '../../assets/photos/map.png'
import Button from "../Button"
import settingsIcon from '../../assets/svg/settings.svg'
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
        </div>
      </div>
    </>
  );
}