import { startTransition } from '@lib/main';
import Binder from '@lib/registry/Binder';
import { useRef, useState } from 'react';
import Button from '../../components/Button';
import Example from '../../components/Example';
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
        <Binder transitions={{ 'size-button': { duration: 300 } }}>
          <Button
            onClick={() => {
              const newElement = list.length ? Math.max(...list) + 1 : 1;

              startTransition(
                ['size-button', 'size-container', ...[...list, newElement].map((i) => `size-button-${i}`).reverse()],
                () => {
                  setLoading((prev) => !prev);
                  setList((prev) => [...prev, newElement]);
                }
              );
            }}
          >
            {isLoading ? 'Loading...' : 'Load'}
          </Button>
        </Binder>
        <Binder transitions={{ 'size-container': { duration: 300 } }}>
          <div ref={listRef} className={styles.list}>
            {list.map((i) => (
              <Binder
                key={i}
                transitions={{
                  [`size-button-${i}`]: {
                    enterKeyframes: [
                      { transform: 'translateY(-50px)', opacity: '0' },
                      { transform: 'translateY(0)', opacity: '1' },
                    ],
                    exitKeyframes: 'reversedEnter',
                    duration: 300,
                  },
                }}
              >
                <Button
                  onClick={() =>
                    startTransition(['size-container', ...list.map((i) => `size-button-${i}`)], () =>
                      setList((prev) => prev.filter((j) => j != i))
                    )
                  }
                >
                  Delete {i}
                </Button>
              </Binder>
            ))}
          </div>
        </Binder>
      </div>
    </Example>
  );
};

export default ContentSizeChange;
