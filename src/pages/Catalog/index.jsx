import React from 'react'
import { Button } from '@maxhub/max-ui';
import './Catalog.css'
import TaskCard from '../../components/TaskCard';
import ModalFeedback from '../../components/ModalFeedback';

export default function Home() {
  return (
    <div>
      <ModalFeedback type="report"></ModalFeedback>
      <div className="add-task-btn gradient-primary-bg color-white">+</div>
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
