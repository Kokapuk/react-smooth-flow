import Binder from '@lib/registry/Binder';
import startTransition from '@lib/startTransition';
import { useState } from 'react';
import Button from '../../components/Button';
import Example from '../../components/Example';
import styles from './Layout.module.scss';

const Layout = () => {
  const [isExpanded, setExpanded] = useState(false);
  const [isAdded, setAdded] = useState(false);
  const [isJumped, setJumped] = useState(false);

  return (
    <Example title="Layout" style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>
      <div className={styles.container}>
        <Button disabled>Surrounding</Button>
        <Binder transitions={{ 'layoutTarget-1': { transitionLayout: true } }}>
          <Button
            style={{ marginInline: isExpanded ? 25 : 0 }}
            onClick={() => startTransition(['layoutTarget-1'], () => setExpanded((prev) => !prev))}
          >
            {isExpanded ? 'Expanded - Shrink' : 'Expand'}
          </Button>
        </Binder>
        <Button disabled>Surrounding</Button>
      </div>

      <div className={styles.container}>
        <Button disabled>Surrounding</Button>
        {isAdded && (
          <Binder
            transitions={{
              'layoutTarget-2': {
                transitionLayout: true,
                enterKeyframes: { opacity: [0, 0.5] },
                exitKeyframes: 'reversedEnter',
              },
            }}
          >
            <Button disabled>Added</Button>
          </Binder>
        )}
        <Button onClick={() => startTransition(['layoutTarget-2'], () => setAdded((prev) => !prev))}>
          Toggle added
        </Button>
      </div>

      <div className={styles.advancedContainer}>
        <div className={styles.wrapper}>
          {!isJumped && (
            <Binder transitions={{ 'layoutTarget-3': { transitionLayout: true } }}>
              <Button onClick={() => startTransition(['layoutTarget-3'], () => setJumped(true))}>Jump</Button>
            </Binder>
          )}
          <Button disabled>Test</Button>
        </div>
        <div className={styles.wrapper}>
          <Button disabled>Test</Button>
          {isJumped && (
            <Binder transitions={{ 'layoutTarget-3': { transitionLayout: true } }}>
              <Button onClick={() => startTransition(['layoutTarget-3'], () => setJumped(false))}>Jump</Button>
            </Binder>
          )}
        </div>
      </div>
    </Example>
  );
};

export default Layout;
