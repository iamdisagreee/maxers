import React from 'react'
import './NavBar.css'
import logo from '../../assets/svg/logo.svg'

export default function NavBar() {
  return (
    <div className="header_nav">
      <img src={logo} alt="dasda" className='logo-svg'/>
      <span className="logo-text color-white inter-700">Рядом</span>
    </div>
  )
}
