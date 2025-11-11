import React from 'react'
import { Button } from '@maxhub/max-ui';
import './Catalog.css'
import TaskCard from '../../components/TaskCard';
import ModalConfirm from '../../components/ModalConfirm';

export default function Home() {
  return (
    <div>
      <ModalConfirm></ModalConfirm>
      <div className="catalog-h">
        <h1 className='h1 inter-700 gradient-primary'>Каталог</h1>
      </div>
      <div className='tasks-wrapper'>
        <TaskCard type='inneed'></TaskCard>
        <TaskCard type='inneed'></TaskCard>
        <TaskCard type='helper'></TaskCard>
        <TaskCard type='helper'></TaskCard>
      </div>
    </div>
  
  )
}
