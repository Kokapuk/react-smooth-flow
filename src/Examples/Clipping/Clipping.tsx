import { constructTransition, constructTransitionRoot, startTransition } from '@lib/main';
import { useState } from 'react';
import Button from '../../components/Button';
import Example from '../../components/Example';
import styles from './Clipping.module.scss';

const Clipping = () => {
  const [isToggled, setToggled] = useState(true);

  return (
    <Example title="Clipping" style={{ width: 250 }}>
      <div className={styles.container} {...constructTransitionRoot('clippingContainer')}>
        <div
          className={styles.target}
          style={isToggled ? undefined : { visibility: 'hidden' }}
          {...constructTransition({
            nonClipped: {
              enterKeyframes: [{ transform: 'translateX(-125%)' }, { transform: 'translateX(0)' }],
              exitKeyframes: 'reversedEnter',
              transitionRootTag: 'clippingContainer',
              duration: 600,
              disabled: !isToggled,
            },
          })}
        >
          Non Clipped
        </div>
        <div
          className={styles.target}
          style={isToggled ? undefined : { visibility: 'hidden' }}
          {...constructTransition({
            clipped: {
              enterKeyframes: [
                { transform: 'translateX(-100%)', clipPath: 'inset(0 0 0 100%)' },
                { transform: 'translateX(0)', clipPath: 'inset(0 0 0 0)' },
              ],
              exitKeyframes: 'reversedEnter',
              duration: 600,
              disabled: !isToggled,
            },
          })}
        >
          Clipped
        </div>
        <Button onClick={() => startTransition(['nonClipped', 'clipped'], () => setToggled((prev) => !prev))}>
          Toggle
        </Button>
      </div>
    </Example>
  );
};

export default Clipping;
