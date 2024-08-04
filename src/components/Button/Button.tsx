import cn from 'classnames';
import { DetailedHTMLProps, forwardRef } from 'react';
import styles from './Button.module.scss';

const Button = forwardRef<
  HTMLButtonElement,
  DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
>((props, ref) => {
  return <button {...props} ref={ref} className={cn(styles.button, props.className)} />;
});

export default Button;
