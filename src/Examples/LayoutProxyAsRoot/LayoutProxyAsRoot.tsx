import { Binder, startTransition } from '@lib/main';
import { useState } from 'react';
import Button from '../../components/Button';
import Example from '../../components/Example';
import styles from './LayoutProxyAsRoot.module.scss';

const LayoutProxyAsRoot = () => {
  const [isToggled, setToggled] = useState(false);

  return (
    <Example title="Layout As Proxy" style={{ width: 250 }}>
      <div className={styles.wrapper}>
        {isToggled && (
          <Binder
            transitions={{
              buttonLayoutProxyRoot: {
                duration: 600,
                enterKeyframes: { transform: ['scale(0)', 'scale(1)'] },
                exitKeyframes: 'reversedEnter',
                transitionLayout: true,
                useLayoutProxyAsRoot: true,
              },
            }}
          >
            <Button
              disabled
              style={{ transformOrigin: 'center left' /* To compensate positionAnchor topLeft (by default) */ }}
            >
              Test
            </Button>
          </Binder>
        )}
      </div>
      <Button onClick={() => startTransition(['buttonLayoutProxyRoot'], () => setToggled((prev) => !prev))}>
        Toggle
      </Button>
    </Example>
  );
};

export default LayoutProxyAsRoot;
