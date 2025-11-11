import timeIcon from '../../assets/svg/time.svg'
import searchIcon from '../../assets/svg/search.svg'
import crossIcon from '../../assets/svg/cross.svg'
import checkedIcon from '../../assets/svg/check.svg'

const STATUS_MAP = {
  processing: { text: 'Выполняется', icon: timeIcon, class: 'gradient-primary-bg' },
  searching: { text: 'Ищем волонтёра...', icon: searchIcon, class: 'secondary-bg'},
  cancelled: { text: 'Отменено', icon: crossIcon, class: 'accent-red-bg'},
  cancelled: { text: 'Выполнено', icon: checkedIcon, class: 'gray-bg'},
}

export default STATUS_MAP
