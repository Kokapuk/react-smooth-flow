import { startTransition } from '@lib/main';
import Binder from '@lib/registry/Binder';
import { useState } from 'react';
import Button from '../../components/Button';
import Example from '../../components/Example';
import styles from './Playground.module.scss';

const Playground = () => {
  const [pos, setPos] = useState<'left' | 'center' | 'right'>('center');
  const [isOn, setOn] = useState(true);
  const [inSquare, setInSquare] = useState(false);

  const moveBtn = () => {
    startTransition(['moveBtn'], () =>
      setPos((prev) => {
        switch (prev) {
          case 'left':
            return 'center';
          case 'center':
            return 'right';
          case 'right':
            return 'left';
        }
      })
    );
  };

  const toggleSwitch = () => {
    startTransition(['switchIndicator', 'switchBtn'], () => setOn((prev) => !prev));
  };

  return (
    <Example title="Playground" style={{ width: 250, display: 'flex', flexDirection: 'column', gap: 15 }}>
      <div>
        <Binder transitions={{ ['moveBtn']: { duration: 600, transitionLayout: true } }}>
          <Button
            style={{
              display: 'block',
              marginInline: { left: 0, center: 'auto', right: 'auto 0' }[pos],
              borderRadius: { left: 0, center: 0, right: '17px' }[pos],
              backgroundColor: { left: 'red', center: 'orange', right: 'green' }[pos],
              borderColor: { left: 'orange', center: 'green', right: 'red' }[pos],
              borderStyle: 'solid',
              borderWidth: { left: '10px', center: '5px', right: '3px' }[pos],
              opacity: { left: 0.25, center: 0.75, right: 1 }[pos],
            }}
            onClick={moveBtn}
          >
            {pos === 'left' && '->'}
            {pos === 'center' && '->'}
            {pos === 'right' && '<------'}
          </Button>
        </Binder>
      </div>
      <div>
        {isOn && (
          <Binder
            transitions={{
              switchIndicator: {
                enterKeyframes: [
                  { transform: 'scale(.8)', opacity: '0' },
                  { transform: 'scale(1)', opacity: '1' },
                ],
                exitKeyframes: 'reversedEnter',
                duration: 600,
                transitionLayout: true,
              },
            }}
          >
            <div className={styles.indicator} />
          </Binder>
        )}
        <Binder transitions={{ switchBtn: { duration: 600 } }}>
          <Button onClick={toggleSwitch} style={{ display: 'block', marginInline: 'auto' }}>
            {isOn ? 'Switch Off' : 'Switch On'}
          </Button>
        </Binder>
      </div>

      <div style={{ display: 'flex', gap: 15 }}>
        {!inSquare && (
          <Binder transitions={{ switchSquare: { duration: 600 } }}>
            <div style={{ background: 'red', width: '50%', height: 50 }} />
          </Binder>
        )}
        <Binder transitions={{ switchContainer: { duration: 600, positionAnchor: 'topRight' } }}>
          <div
            style={{
              border: '1px solid white',
              width: '50%',
              minHeight: 20,
              height: 'min-content',
              marginLeft: 'auto',
            }}
          >
            {inSquare && (
              <Binder transitions={{ switchSquare: { duration: 600 } }}>
                <div style={{ background: 'red', width: '100%', height: 48 }} />
              </Binder>
            )}
          </div>
        </Binder>
      </div>
      <Button onClick={() => startTransition(['switchContainer', 'switchSquare'], () => setInSquare((prev) => !prev))}>
        Switch
      </Button>
    </Example>
  );
};

export default Playground;
