import { constructTransition, startTransition } from '@lib/main';
import cn from 'classnames';
import { useState } from 'react';
import Button from '../../components/Button';
import Example from '../../components/Example';
import styles from './Playground.module.scss';

const Playground = () => {
  const [pos, setPos] = useState<'left' | 'center' | 'right'>('center');
  const [isOn, setOn] = useState(true);
  const [inSquare, setInSquare] = useState(false);

  const moveBtn = () => {
    startTransition(['moveBtn'], { duration: 600 }, () =>
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
    startTransition(['switchIndicator', 'switchBtn'], { duration: 600 }, () => setOn((prev) => !prev));
  };

  return (
    <Example title="Playground" style={{ width: 250, display: 'flex', flexDirection: 'column', gap: 15 }}>
      <div>
        <Button
          {...constructTransition({ moveBtn: {} })}
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
      </div>
      <div>
        {isOn && (
          <div
            {...constructTransition({
              switchIndicator: {
                enterKeyframes: [
                  { transform: 'scale(.8)', opacity: '0' },
                  { transform: 'scale(1)', opacity: '1' },
                ],
                exitKeyframes: 'reversedEnter',
              },
            })}
            className={cn(styles.indicator, !isOn && styles.inactive)}
          />
        )}
        <Button
          {...constructTransition({ switchBtn: {} })}
          onClick={toggleSwitch}
          style={{ display: 'block', marginInline: 'auto' }}
        >
          {isOn ? 'Switch Off' : 'Switch On'}
        </Button>
      </div>

      <div style={{ display: 'flex', gap: 15 }}>
        {!inSquare && (
          <div {...constructTransition({ switchSquare: {} })} style={{ background: 'red', width: '50%', height: 50 }} />
        )}
        <div
          {...constructTransition({ switchContainer: {} })}
          style={{ border: '1px solid white', width: '50%', minHeight: 20, height: 'min-content', marginLeft: 'auto' }}
        >
          {inSquare && (
            <div
              {...constructTransition({ switchSquare: {} })}
              style={{ background: 'red', width: '100%', height: 50 }}
            />
          )}
        </div>
      </div>
      <Button
        onClick={() =>
          startTransition(['switchContainer', 'switchSquare'], { duration: 600 }, () => setInSquare((prev) => !prev))
        }
      >
        Switch
      </Button>
    </Example>
  );
};

export default Playground;
