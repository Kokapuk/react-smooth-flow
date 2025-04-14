import constructTransition from '@lib/constructTransition';
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
        <Button>Surrounding</Button>
        <Button
          style={{ marginInline: isExpanded ? 25 : 0 }}
          onClick={() => startTransition(['layoutTarget-1'], () => setExpanded((prev) => !prev))}
          {...constructTransition({ 'layoutTarget-1': { transitionLayout: true } })}
        >
          {isExpanded ? 'Expanded - Shrink' : 'Expand'}
        </Button>
        <Button>Surrounding</Button>
      </div>

      <div className={styles.container}>
        <Button>Surrounding</Button>
        {isAdded && <Button {...constructTransition({ 'layoutTarget-2': { transitionLayout: true } })}>Added</Button>}
        <Button onClick={() => startTransition(['layoutTarget-2'], () => setAdded((prev) => !prev))}>
          Toggle added
        </Button>
      </div>

      <div className={styles.advancedContainer}>
        <div className={styles.wrapper}>
          {!isJumped && (
            <Button
              {...constructTransition({ 'layoutTarget-3': { transitionLayout: true } })}
              onClick={() => startTransition(['layoutTarget-3'], () => setJumped(true))}
            >
              Jump
            </Button>
          )}
          <Button>Test</Button>
        </div>
        <div className={styles.wrapper}>
          <Button>Test</Button>
          {isJumped && (
            <Button
              {...constructTransition({ 'layoutTarget-3': { transitionLayout: true } })}
              onClick={() => startTransition(['layoutTarget-3'], () => setJumped(false))}
            >
              Jump
            </Button>
          )}
        </div>
      </div>
    </Example>
  );
};

export default Layout;
