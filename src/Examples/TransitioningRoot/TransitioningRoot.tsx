import constructTransition from '@lib/constructTransition';
import constructTransitionRoot from '@lib/constructTransitionRoot';
import startTransition from '@lib/startTransition';
import { useState } from 'react';
import Button from '../../components/Button';
import Example from '../../components/Example';
import styles from './TransitioningRoot.module.scss';

const TransitioningRoot = () => {
  const [isToggled, setToggled] = useState(false);

  return (
    <Example title="Transitioning Root">
      <Button
        onClick={() => startTransition(['modal', 'modalContent', 'modalIndicator'], () => setToggled((prev) => !prev))}
        style={{ marginBottom: 25 }}
      >
        Toggle
      </Button>
      <div className={styles.wrapper}>
        <div
          className={styles.modal}
          {...constructTransitionRoot('modal')}
          {...constructTransition({ modal: { duration: 800 } })}
        >
          <h3>Modal Title</h3>
          <p
            {...constructTransition({
              modalContent: {
                duration: 800,
                forcePresenceTransition: true,
                enterKeyframes: { transform: ['translateX(-115%)', 'translateX(0)'] },
                exitKeyframes: { transform: ['translateX(0)', 'translateX(115%)'] },
                relevantStyleProperties: ['color'],
                transitionRootTag: 'modal',
              },
            })}
          >
            {isToggled
              ? 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima vitae cumque voluptas? Libero placeat earum recusandae et, hic ipsa sed possimus, aliquam sapiente accusantium voluptate natus autem molestias necessitatibus similique. Harum dolorem, perspiciatis quae reprehenderit quis accusantium dignissimos'
              : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam, placeat sequi architecto delectus sint cumque dolor dicta, nam nulla atque qui molestiae et sapiente odit molestias mollitia perspiciatis error voluptatibus.'}
          </p>
          <div
            style={{ backgroundColor: isToggled ? 'green' : 'red' }}
            className={styles.indicator}
            {...constructTransition({
              modalIndicator: {
                duration: 800,
                forcePresenceTransition: true,
                enterKeyframes: { transform: ['scale(0)', 'scale(0)', 'scale(1)'] },
                exitKeyframes: 'reversedEnter',
                transitionRootTag: 'modal',
                positionAnchor: 'bottomRight',
              },
            })}
          />
        </div>
      </div>
    </Example>
  );
};

export default TransitioningRoot;
