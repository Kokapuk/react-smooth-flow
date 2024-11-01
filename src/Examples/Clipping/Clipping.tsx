import { useState } from 'react';
import Button from '../../components/Button';
import Example from '../../components/Example';
import styles from './Clipping.module.scss';
import constructViewTransition from '../../utils/ViewTransition/constructViewTransition';
import startViewTransition from '../../utils/ViewTransition/startViewTransition';
import { flushSync } from 'react-dom';

const Clipping = () => {
  const [isToggled, setToggled] = useState(true);

  return (
    <Example
      title="Clipping"
      style={{ width: 250, display: 'flex', flexDirection: 'column', gap: 15, overflow: 'hidden' }}
    >
      <div
        className={styles.target}
        style={isToggled ? undefined : { visibility: 'hidden' }}
        {...(isToggled
          ? constructViewTransition({
              tag: 'nonClipped',
              enterKeyframes: [{ transform: 'translateX(-125%)' }, { transform: 'translateX(0)' }],
              exitKeyframes: 'reversedEnter',
              useParentAsTransitionRoot: true,
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
              tag: 'clipped',
              enterKeyframes: [
                { transform: 'translateX(-125%)', clipPath: 'inset(0 0 0 125%)' },
                { transform: 'translateX(0)', clipPath: 'inset(0 0 0 0)' },
              ],
              exitKeyframes: 'reversedEnter',
            })
          : null)}
      >
        Clipped
      </div>
      <Button
        onClick={() =>
          startViewTransition(['nonClipped', 'clipped'], { duration: 600 }, () =>
            flushSync(() => setToggled((prev) => !prev))
          )
        }
      >
        Toggle
      </Button>
    </Example>
  );
};

export default Clipping;
