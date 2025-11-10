import pillIcon from '../../assets/svg/pill.svg'
import repairIcon from '../../assets/svg/repair.svg'
import gadgetsIcon from '../../assets/svg/gadgets.svg'
import dumbellIcon from '../../assets/svg/dumbell.svg'
import otherIcon from '../../assets/svg/other.svg'
import chatIcon from '../../assets/svg/chat.svg'

const STATUS_MAP = {
  pill: { text: 'Медикаменты', icon: pillIcon },
  repair: { text: 'Мелкий ремонт', icon: repairIcon },
  gadgets: { text: 'Помощь с техникой', icon: gadgetsIcon },
  dumbell: { text: 'Физическая помощь', icon: dumbellIcon },
  other: { text: 'Разное', icon: otherIcon },
  chat: { text: 'Общение и компания', icon: chatIcon },
}

export default STATUS_MAP
