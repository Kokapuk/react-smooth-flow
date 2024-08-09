import { useRef } from 'react';
import Button from '../../components/Button';
import Example from '../../components/Example';
import LayoutTransition from '../../utils/LayoutTransition';
import useDelayedState from '../../utils/useDelayedState';
import styles from './ContentSizeChange.module.scss';

const ContentSizeChange = () => {
  const [isLoading, setLoading] = useDelayedState(false);
  const [list, setList] = useDelayedState(
    Array(3)
      .fill(0)
      .map((_, index) => index + 1)
  );
  const listRef = useRef<HTMLDivElement>(null);

  return (
    <Example title="Content size change">
      <div className={styles.container}>
        <LayoutTransition
          duration={300}
          deps={[isLoading.relevant]}
          delayedDeps={[isLoading.delayed]}
          constraints={['size']}
        >
          <Button style={{ overflow: 'hidden' }} onClick={() => setLoading((prev) => !prev)}>
            {isLoading.delayed ? 'Loading...' : 'Load'}
          </Button>
        </LayoutTransition>
        <LayoutTransition
          nodeRef={listRef}
          duration={300}
          deps={[list.relevant]}
          delayedDeps={[list.delayed]}
          constraints={['size']}
        >
          <div ref={listRef} className={styles.list}>
            {list.delayed.map((i) => (
              <LayoutTransition
                positionParent={listRef}
                duration={300}
                deps={[list.relevant]}
                delayedDeps={[list.delayed]}
                key={i}
              >
                <Button onClick={() => setList((prev) => prev.filter((j) => j != i))}>Delete {i}</Button>
              </LayoutTransition>
            ))}
          </div>
        </LayoutTransition>
      </div>
    </Example>
  );
};

export default ContentSizeChange;
