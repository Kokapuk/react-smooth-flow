import { useRef, useState } from 'react';
import Button from '../../components/Button';
import Example from '../../components/Example';
import constructViewTransition from '../../utils/ViewTransition/constructViewTransition';
import startViewTransition from '../../utils/ViewTransition/startViewTransition';
import styles from './ContentSizeChange.module.scss';

const ContentSizeChange = () => {
  const [isLoading, setLoading] = useState(false);
  const [list, setList] = useState(
    Array(3)
      .fill(0)
      .map((_, index) => index + 1)
  );
  const listRef = useRef<HTMLDivElement>(null);

  return (
    <Example title="Content size change">
      <div className={styles.container}>
        <Button
          {...constructViewTransition({ 'size-button': {} })}
          onClick={() => {
            const newElement = list.length ? Math.max(...list) + 1 : 1;

            startViewTransition(
              ['size-button', 'size-container', ...[...list, newElement].map((i) => `size-button-${i}`).reverse()],
              { duration: 300 },
              () => {
                setLoading((prev) => !prev);
                setList((prev) => [...prev, newElement]);
              }
            );
          }}
        >
          {isLoading ? 'Loading...' : 'Load'}
        </Button>
        <div {...constructViewTransition({ 'size-container': {} })} ref={listRef} className={styles.list}>
          {list.map((i) => (
            <Button
              key={i}
              {...constructViewTransition({
                [`size-button-${i}`]: {
                  enterKeyframes: [
                    { transform: 'translateY(-50px)', opacity: '0' },
                    { transform: 'translateY(0)', opacity: '1' },
                  ],
                  exitKeyframes: 'reversedEnter',
                },
              })}
              onClick={() =>
                startViewTransition(['size-container', ...list.map((i) => `size-button-${i}`)], { duration: 300 }, () =>
                  setList((prev) => prev.filter((j) => j != i))
                )
              }
            >
              Delete {i}
            </Button>
          ))}
        </div>
      </div>
    </Example>
  );
};

export default ContentSizeChange;
