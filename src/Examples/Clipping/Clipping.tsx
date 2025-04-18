import { startTransition } from '@lib/main';
import Binder from '@lib/registry/Binder';
import { useState } from 'react';
import Button from '../../components/Button';
import Example from '../../components/Example';
import styles from './Clipping.module.scss';

const Clipping = () => {
  const [isToggled, setToggled] = useState(true);

  return (
    <Example title="Clipping" style={{ width: 250 }}>
      <Binder root="clippingContainer">
        <div className={styles.container}>
          <Binder
            transitions={{
              nonClipped: {
                enterKeyframes: { transform: ['translateX(-125%)', 'translateX(0)'] },
                exitKeyframes: 'reversedEnter',
                transitionRootTag: 'clippingContainer',
                duration: 600,
                disabled: !isToggled,
              },
            }}
          >
            <div className={styles.target} style={isToggled ? undefined : { visibility: 'hidden' }}>
              Non Clipped
            </div>
          </Binder>
          <Binder
            transitions={{
              clipped: {
                enterKeyframes: [
                  { transform: 'translateX(-100%)', clipPath: 'inset(0 0 0 100%)' },
                  { transform: 'translateX(0)', clipPath: 'inset(0 0 0 0)' },
                ],
                exitKeyframes: 'reversedEnter',
                duration: 600,
                disabled: !isToggled,
              },
            }}
          >
            <div className={styles.target} style={isToggled ? undefined : { visibility: 'hidden' }}>
              Clipped
            </div>
          </Binder>
          <Button onClick={() => startTransition(['nonClipped', 'clipped'], () => setToggled((prev) => !prev))}>
            Toggle
          </Button>
        </div>
      </Binder>
    </Example>
  );
};

export default Clipping;
