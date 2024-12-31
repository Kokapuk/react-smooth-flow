import { constructViewTransition, constructViewTransitionRoot, startViewTransition } from '@lib/main';
import { useState } from 'react';
import Button from '../../components/Button';
import Example from '../../components/Example';
import styles from './Clipping.module.scss';

const Clipping = () => {
  const [isToggled, setToggled] = useState(true);

  return (
    <Example
      title="Clipping"
      style={{
        width: 250,
      }}
    >
      <div className={styles.container} {...constructViewTransitionRoot('clippingContainer')}>
        <div
          className={styles.target}
          style={isToggled ? undefined : { visibility: 'hidden' }}
          {...(isToggled
            ? constructViewTransition({
                nonClipped: {
                  enterKeyframes: [{ transform: 'translateX(-125%)' }, { transform: 'translateX(0)' }],
                  exitKeyframes: 'reversedEnter',
                  viewTransitionRootTag: 'clippingContainer',
                },
              })
            : null)}
        >
          Non Clipped
        </div>
        <div
          className={styles.target}
          style={isToggled ? undefined : { visibility: 'hidden' }}
          {...(isToggled
            ? constructViewTransition({
                clipped: {
                  enterKeyframes: [
                    { transform: 'translateX(-100%)', clipPath: 'inset(0 0 0 100%)' },
                    { transform: 'translateX(0)', clipPath: 'inset(0 0 0 0)' },
                  ],
                  exitKeyframes: 'reversedEnter',
                },
              })
            : null)}
        >
          Clipped
        </div>
        <Button
          onClick={() =>
            startViewTransition(['nonClipped', 'clipped'], { duration: 600 }, () => setToggled((prev) => !prev))
          }
        >
          Toggle
        </Button>
      </div>
    </Example>
  );
};

export default Clipping;
