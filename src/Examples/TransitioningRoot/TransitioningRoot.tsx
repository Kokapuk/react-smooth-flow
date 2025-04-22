import Binder from '@lib/registry/Binder';
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
        <Binder root="modal" transitions={{ modal: { duration: 800 } }}>
          <div className={styles.modal}>
            <h3>Modal Title</h3>
            <Binder
              transitions={{
                modalContent: {
                  duration: 800,
                  forcePresenceTransition: true,
                  enterKeyframes: { transform: ['translateX(-115%)', 'translateX(0)'] },
                  exitKeyframes: { transform: ['translateX(0)', 'translateX(115%)'] },
                  relevantStyleProperties: ['color'],
                  root: 'modal',
                },
              }}
            >
              <p>
                {isToggled
                  ? 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima vitae cumque voluptas? Libero placeat earum recusandae et, hic ipsa sed possimus, aliquam sapiente accusantium voluptate natus autem molestias necessitatibus similique. Harum dolorem, perspiciatis quae reprehenderit quis accusantium dignissimos'
                  : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam, placeat sequi architecto delectus sint cumque dolor dicta, nam nulla atque qui molestiae et sapiente odit molestias mollitia perspiciatis error voluptatibus.'}
              </p>
            </Binder>
            <Binder
              transitions={{
                modalIndicator: {
                  duration: 800,
                  forcePresenceTransition: true,
                  enterKeyframes: { transform: ['scale(0)', 'scale(0)', 'scale(1)'] },
                  exitKeyframes: 'reversedEnter',
                  root: 'modal',
                  positionAnchor: 'bottomRight',
                },
              }}
            >
              <div style={{ backgroundColor: isToggled ? 'green' : 'red' }} className={styles.indicator} />
            </Binder>
          </div>
        </Binder>
      </div>
    </Example>
  );
};

export default TransitioningRoot;
