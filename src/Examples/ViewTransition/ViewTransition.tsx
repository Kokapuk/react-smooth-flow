import cn from 'classnames';
import { useState } from 'react';
import { flushSync } from 'react-dom';
import Button from '../../components/Button';
import Example from '../../components/Example';
import constructViewTransition from '../../utils/ViewTransition/constructViewTransition';
import startViewTransition from '../../utils/ViewTransition/startViewTransition';
import styles from './ViewTransition.module.scss';

const ViewTransition = () => {
  const [pos, setPos] = useState<'left' | 'center' | 'right'>('center');
  const [isOn, setOn] = useState(true);

  const moveBtn = () => {
    startViewTransition(['moveBtn'], { duration: 600 }, () => {
      flushSync(() =>
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
    });
  };

  const toggleSwitch = () => {
    startViewTransition(['switchBtn', 'switchIndicator'], { duration: 600 }, () => {
      flushSync(() => setOn((prev) => !prev));
    });
  };

  return (
    <Example title="View Transition" style={{ width: 250, display: 'flex', flexDirection: 'column', gap: 15 }}>
      <div>
        <Button
          {...constructViewTransition({ tag: 'moveBtn' })}
          style={{
            display: 'block',
            marginInline: { left: 0, center: 'auto', right: 'auto 0' }[pos],
            borderRadius: { left: 0, center: 0, right: '17px' }[pos],
            backgroundColor: { left: 'red', center: 'orange', right: 'green' }[pos],
          }}
          onClick={moveBtn}
        >
          {pos === 'left' && '->'}
          {pos === 'center' && '->'}
          {pos === 'right' && '<---'}
        </Button>
      </div>
      <div>
        {isOn && (
          <div
            {...constructViewTransition({
              tag: 'switchIndicator',
              animationClass: styles.indicatorTransition,
            })}
            className={cn(styles.indicator, !isOn && styles.inactive)}
          />
        )}
        <Button
          {...constructViewTransition({ tag: 'switchBtn' })}
          onClick={toggleSwitch}
          style={{ display: 'block', marginInline: 'auto' }}
        >
          {isOn ? 'Switch Off' : 'Switch On'}
        </Button>
      </div>
    </Example>
  );
};

export default ViewTransition;
