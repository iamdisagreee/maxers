import { forwardRef } from 'react';
import './Button.css';

export const Button = forwardRef(({
  size = 'medium',
  mode = 'primary',
  appearance = 'themed',
  stretched = false,
  iconBefore = null,
  iconAfter = null,
  indicator = null,
  loading = false,
  gradient = null,
  textColor = null,
  children,
  className = '',
  disabled = false,
  innerClassNames = {},
  ...props
}, ref) => {
  
  const buttonClasses = [
    'custom-button',
    `button-size-${size}`,
    `button-mode-${mode}`,
    !gradient && `button-appearance-${appearance}`,
    stretched && 'button-stretched',
    loading && 'button-loading',
    gradient && `button-gradient-${gradient}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className={`button-spinner-container ${innerClassNames.spinnerContainer || ''}`}>
          <span className={`button-spinner ${innerClassNames.spinner || ''}`} />
        </span>
      )}
      
      {iconBefore && (
        <span className={`button-icon-before ${innerClassNames.iconBefore || ''}`}>
          {iconBefore}
        </span>
      )}
      
      <span className={`button-content ${innerClassNames.content || ''}`}>
        {children}
      </span>
      
      {iconAfter && (
        <span className={`button-icon-after ${innerClassNames.iconAfter || ''}`}>
          {iconAfter}
        </span>
      )}
      
      {indicator && (
        <span className={`button-indicator ${innerClassNames.indicator || ''}`}>
          {indicator}
        </span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;



// // Размеры
// <Button size="small">Small</Button>
// <Button size="medium">Medium</Button>  // по умолчанию
// <Button size="large">Large</Button>

// // Режимы
// <Button mode="primary">Primary</Button>  // заливка
// <Button mode="secondary">Secondary</Button>  // обводка
// <Button mode="tertiary">Tertiary</Button>  // прозрачный фон
// <Button mode="link">Link</Button>  // как ссылка

// // Цвета (appearance)
// <Button appearance="lprimary">Light Primary</Button>
// <Button appearance="primary">Primary</Button>
// <Button appearance="dprimary">Dark Primary</Button>
// <Button appearance="lsecondary">Light Secondary</Button>
// <Button appearance="secondary">Secondary</Button>
// <Button appearance="dsecondary">Dark Secondary</Button>
// <Button appearance="black">Black</Button>
// <Button appearance="white">White</Button>

// // Градиенты (игнорирует appearance)
// <Button gradient="lprimary-dprimary">Gradient</Button>
// <Button gradient="dprimary-lprimary">Reverse</Button>
// <Button gradient="lsecondary-dsecondary">Green Gradient</Button>
// <Button gradient="dsecondary-lsecondary">Reverse Green</Button>
// <Button gradient="primary-secondary">Mixed</Button>

// // Иконки и индикаторы
// <Button iconBefore={<Icon />}>With Icon</Button>
// <Button iconAfter={<Icon />}>Icon After</Button>
// <Button indicator={<span>•</span>}>With Indicator</Button>

// // Состояния
// <Button loading>Loading...</Button>
// <Button disabled>Disabled</Button>
// <Button stretched>Full Width</Button>

// // Комбинация
// <Button 
//   size="large" 
//   gradient="lprimary-dprimary"
//   iconBefore={<Icon />}
//   loading={isLoading}
// >
//   Submit
// </Button>