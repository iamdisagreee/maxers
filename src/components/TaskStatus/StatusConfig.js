import timeIcon from '../../assets/svg/time.svg'
import searchIcon from '../../assets/svg/search2.svg'
import crossIcon from '../../assets/svg/cross.svg'
import checkedIcon from '../../assets/svg/check.svg'

const STATUS_MAP = {
  Process: { text: 'Выполняется', icon: timeIcon, class: 'secondary-bg', description: "Свяжитесь чтобы договориться о деталях "},
  Pending: { text: 'Ищем волонтёра...', icon: searchIcon, class: 'gradient-primary-bg', description: "Скоро найдём вам волонтёра"},
  Cancelled: { text: 'Отменено', icon: crossIcon, class: 'accent-red-bg', description: "Волонтёр выполнил вашу просьбу"},
  Completed: { text: 'Выполнено', icon: checkedIcon, class: 'gray-bg', description: "Просьба была не выполнена или вы отменили её"},
}

export default STATUS_MAP
