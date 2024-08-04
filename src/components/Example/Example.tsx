import { CSSProperties, forwardRef, ReactNode } from 'react';
import styles from './Example.module.scss';

interface Props {
  children: ReactNode;
  title: string;
  style?: CSSProperties;
}

const Example = forwardRef<HTMLDivElement, Props>(({ children, title, style }, ref) => {
  return (
    <div ref={ref} className={styles.example} style={{ '--title': `"${title}"`, ...style } as CSSProperties}>
      {children}
    </div>
  );
});

export default Example;
