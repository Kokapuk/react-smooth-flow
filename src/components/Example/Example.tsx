import { CSSProperties, ReactNode, Ref } from 'react';
import styles from './Example.module.scss';

interface Props {
  children: ReactNode;
  title: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
}

const Example = ({ children, title, style, ref }: Props) => {
  return (
    <div ref={ref} className={styles.example} data-title={title} style={{ ...style } as CSSProperties}>
      {children}
    </div>
  );
};

export default Example;
