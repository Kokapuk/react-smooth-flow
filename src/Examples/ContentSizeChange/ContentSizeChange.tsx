import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
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
          {...constructViewTransition({ tag: 'size-button' })}
          onClick={() => {
            startViewTransition(
              ['size-button', 'size-container', ...list.map((i) => `size-button-${i}`).reverse()],
              { duration: 300 },
              () =>
                flushSync(() => {
                  setLoading((prev) => !prev);
                  setList((prev) => [...prev, prev.length ? Math.max(...prev) + 1 : 1]);
                })
            );
          }}
        >
          {isLoading ? 'Loading...' : 'Load'}
        </Button>
        <div {...constructViewTransition({ tag: 'size-container' })} ref={listRef} className={styles.list}>
          {list.map((i) => (
            <Button
              key={i}
              {...constructViewTransition({ tag: `size-button-${i}` })}
              onClick={() =>
                startViewTransition(
                  ['size-container', ...list.map((i) => `size-button-${i}`)],
                  { duration: 300 },
                  () => flushSync(() => setList((prev) => prev.filter((j) => j != i)))
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
