import { useEffect } from 'react';
import Button from '../../components/Button';
import Example from '../../components/Example';
import LayoutTransition from '../../utils/LayoutTransition';
import useDelayedState from '../../utils/useDelayedState';
import styles from './AnimatedList.module.scss';

const AnimatedList = () => {
  const [buttons, setButtons] = useDelayedState(
    Array(9)
      .fill(0)
      .map((_, index) => index + 1)
  );

  useEffect(() => {
    if (buttons.relevant.length) {
      return;
    }

    setTimeout(() => {
      setButtons(
        Array(9)
          .fill(0)
          .map((_, index) => index + 1)
      );
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttons.relevant.length]);

  const shuffle = () => {
    setButtons((prev) => {
      const copy = [...prev];

      for (let i = 0; i < copy.length; i++) {
        const aIndex = Math.round(Math.random() * (copy.length - 1));
        const bIndex = Math.round(Math.random() * (copy.length - 1));

        [copy[aIndex], copy[bIndex]] = [copy[bIndex], copy[aIndex]];
      }

      return copy;
    });
  };

  const addElement = () => {
    setButtons((prev) => (prev.length ? [...prev, Math.max(...prev) + 1] : [1]));
  };

  return (
    <Example title="Animated list">
      <div style={{ marginBottom: '20px', display: 'flex', gap: 30, justifyContent: 'center' }}>
        <Button onClick={shuffle}>Shuffle</Button>
        <Button onClick={addElement}>Add</Button>
      </div>
      <div className={styles.grid}>
        {buttons.delayed.map((i) => (
          <LayoutTransition key={i} deps={[buttons.relevant]} delayedDeps={[buttons.delayed]} duration={300}>
            <Button key={i} onClick={() => setButtons((prev) => prev.filter((j) => j !== i))}>
              Delete {i}
            </Button>
          </LayoutTransition>
        ))}
      </div>
    </Example>
  );
};

export default AnimatedList;
