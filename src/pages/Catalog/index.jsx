import React from 'react'
import { Button } from '@maxhub/max-ui';
import './Catalog.css'
import TaskCard from '../../components/TaskCard';

export default function Home() {
  return (
    <div>
      <div className="catalog-h">
        <h1 className='h1 inter-700 gradient-primary'>Каталог</h1>
      </div>
      <div className='tasks-wrapper'>
        <TaskCard></TaskCard>
        <TaskCard></TaskCard>
        <TaskCard></TaskCard>
        <TaskCard></TaskCard>
        <TaskCard></TaskCard>
      </div>
    </div>
  
  )
}
