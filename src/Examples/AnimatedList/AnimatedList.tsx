import { constructTransition, startTransition } from '@lib/main';
import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Example from '../../components/Example';
import styles from './AnimatedList.module.scss';

const AnimatedList = () => {
  const [buttons, setButtons] = useState(
    Array(9)
      .fill(0)
      .map((_, index) => index + 1)
  );

  useEffect(() => {
    if (buttons.length) {
      return;
    }

    setTimeout(() => {
      setButtons(
        Array(9)
          .fill(0)
          .map((_, index) => index + 1)
      );
    }, 1000);
  }, [buttons.length]);

  const shuffle = () => {
    startTransition(
      buttons.map((i) => `button-${i}`),
      () => {
        setButtons((prev) => {
          const copy = [...prev];

          for (let i = 0; i < copy.length; i++) {
            const aIndex = Math.round(Math.random() * (copy.length - 1));
            const bIndex = Math.round(Math.random() * (copy.length - 1));

            [copy[aIndex], copy[bIndex]] = [copy[bIndex], copy[aIndex]];
          }

          return copy;
        });
      }
    );
  };

  const addElement = () => {
    const newButton = buttons.length ? Math.max(...buttons) + 1 : 1;

    startTransition(
      [`button-${newButton}`],
      () => setButtons((prev) => [...prev, newButton])
    );
  };

  const removeElement = (element: number) => {
    startTransition(
      buttons.filter(i => i >= element).map((i) => `button-${i}`),
      () => setButtons((prev) => prev.filter((j) => j !== element))
    );
  };

  return (
    <Example title="Animated list">
      <div style={{ marginBottom: '20px', display: 'flex', gap: 30, justifyContent: 'center' }}>
        <Button onClick={shuffle}>Shuffle</Button>
        <Button onClick={addElement}>Add</Button>
      </div>
      <div className={styles.grid}>
        {buttons.map((i) => (
          <Button
            {...constructTransition({
              [`button-${i}`]: {
                enterKeyframes: [
                  { transform: 'translateY(-75px)', opacity: '0' },
                  { transform: 'translateY(0)', opacity: '1' },
                ],
                exitKeyframes: 'reversedEnter',
                duration: 300,
              },
            })}
            key={i}
            onClick={() => removeElement(i)}
            style={{ width: 92 }}
          >
            Delete {i}
          </Button>
        ))}
      </div>
    </Example>
  );
};

export default AnimatedList;
