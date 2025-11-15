import { forwardRef, useState } from 'react';
import './Input.css';

const Input = forwardRef(({
  mode = 'primary',
  compact = false,
  iconBefore = null,
  iconAfter = null,
  withClearButton = false,
  borderColor = null,
  gradient = null,
  iconColor = null,
  className = '',
  innerClassNames = {},
  value,
  onChange,
  ...props
}, ref) => {
  
  const [internalValue, setInternalValue] = useState('');
  const inputValue = value !== undefined ? value : internalValue;
  const hasValue = inputValue && inputValue.length > 0;

  const handleChange = (e) => {
    if (value === undefined) {
      setInternalValue(e.target.value);
    }
    if (onChange) {
      onChange(e);
    }
  };

  const handleClear = () => {
    const event = {
      target: { value: '' },
      currentTarget: { value: '' }
    };
    
    if (value === undefined) {
      setInternalValue('');
    }
    if (onChange) {
      onChange(event);
    }
  };

  const bodyClasses = [
    'input-body',
    `input-mode-${mode}`,
    compact && 'input-compact',
    gradient && `input-gradient-${gradient}`,
    className
  ].filter(Boolean).join(' ');

  const bodyStyle = {};
  if (borderColor && !gradient) {
    bodyStyle.borderColor = borderColor;
  }
  if (iconColor) {
    bodyStyle['--icon-color'] = iconColor;
  }

  return (
    <div 
      className={`${bodyClasses} ${innerClassNames.body || ''}`}
      style={bodyStyle}
    >
      {iconBefore && (
        <span className={`input-icon-before ${innerClassNames.iconBefore || ''}`}>
          {iconBefore}
        </span>
      )}
      
      <input
        ref={ref}
        className={`input-field ${innerClassNames.input || ''}`}
        value={inputValue}
        onChange={handleChange}
        {...props}
      />
      
      {withClearButton && hasValue && (
        <button
          type="button"
          className={`input-clear-button ${innerClassNames.clearButton || ''}`}
          onClick={handleClear}
          tabIndex={-1}
        >
          ×
        </button>
      )}
      
      {iconAfter && (
        <span className={`input-icon-after ${innerClassNames.iconAfter || ''}`}>
          {iconAfter}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;


// // Базовое использование
// <Input placeholder="Enter text..." />

// // Режимы
// <Input mode="primary" placeholder="Primary mode" />
// <Input mode="secondary" placeholder="Secondary mode" />

// // Компактный режим
// <Input compact placeholder="Compact input" />

// // С иконками
// <Input 
//   iconBefore={<SearchIcon />} 
//   placeholder="Search..." 
// />
// <Input 
//   iconAfter={<CheckIcon />} 
//   placeholder="Validated input" 
// />

// // Кнопка очистки
// <Input 
//   withClearButton 
//   placeholder="Type to see clear button" 
// />

// // Градиенты для border
// <Input gradient="lprimary-dprimary" placeholder="Gradient border" />
// <Input gradient="lsecondary-dsecondary" placeholder="Green gradient" />
// <Input gradient="primary-secondary" placeholder="Mixed gradient" />

// // Кастомный цвет border
// <Input 
//   borderColor="var(--dprimary)" 
//   placeholder="Custom border color" 
// />
// <Input 
//   borderColor="#ff0000" 
//   placeholder="Red border" 
// />

// // Кастомный цвет иконок
// <Input 
//   iconBefore={<Icon />}
//   iconColor="var(--primary)"
//   placeholder="Blue icons"
// />

// // Комбинация всего
// <Input 
//   mode="primary"
//   gradient="lprimary-dprimary"
//   iconBefore={<SearchIcon />}
//   iconColor="var(--dprimary)"
//   withClearButton
//   compact
//   placeholder="Complex input"
// />

// // Controlled input
// const [value, setValue] = useState('');
// <Input 
//   value={value}
//   onChange={(e) => setValue(e.target.value)}
//   placeholder="Controlled"
// />