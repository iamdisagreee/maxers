import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import './User.css'

export default function User() {
  const { id } = useParams() // получаем параметр из URL

  return (
    <div>
      <h1>User Page</h1>
      <p>User ID: {id}</p>
    </div>
  )
}