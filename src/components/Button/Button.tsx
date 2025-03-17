import cn from 'classnames';
import { DetailedHTMLProps } from 'react';
import styles from './Button.module.scss';

const Button = (props: DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) => {
  return <button {...props} className={cn(styles.button, props.className)} />;
};

export default Button;
