import pillIcon from '../../assets/svg/pill.svg'
import repairIcon from '../../assets/svg/repair.svg'
import gadgetsIcon from '../../assets/svg/gadgets.svg'
import dumbellIcon from '../../assets/svg/dumbell.svg'
import otherIcon from '../../assets/svg/other.svg'
import chatIcon from '../../assets/svg/chat.svg'

const CATEGORY_MAP = {
  Medicine: { text: 'Медикаменты', icon: pillIcon },
  Repairs: { text: 'Мелкий ремонт', icon: repairIcon },
  Technique: { text: 'Помощь с техникой', icon: gadgetsIcon },
  Physical: { text: 'Физическая помощь', icon: dumbellIcon },
  Different: { text: 'Разное', icon: otherIcon },
  Communication: { text: 'Общение и компания', icon: chatIcon },
}

export default CATEGORY_MAP
