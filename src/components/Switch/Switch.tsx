import cn from 'classnames';
import { ComponentProps } from 'react';
import styles from './Switch.module.scss';

const Switch = (props: Omit<ComponentProps<'input'>, 'type' | 'value' | 'defaultValue'>) => {
  return <input type="checkbox" {...props} className={cn(styles.switch, props.className)} />;
};

export default Switch;
