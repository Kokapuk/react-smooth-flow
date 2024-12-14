import cn from 'classnames';
import { useState } from 'react';
import Button from '../../components/Button';
import Example from '../../components/Example';
import constructViewTransition from '../../utils/ViewTransition/constructViewTransition';
import startViewTransition from '../../utils/ViewTransition/startViewTransition';
import styles from './ViewTransition.module.scss';

const ViewTransition = () => {
  const [pos, setPos] = useState<'left' | 'center' | 'right'>('center');
  const [isOn, setOn] = useState(true);
  const [inSquare, setInSquare] = useState(false);

  const moveBtn = () => {
    startViewTransition(['moveBtn'], { duration: 600 }, () =>
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
    startViewTransition(['switchIndicator', 'switchBtn'], { duration: 600 }, () => setOn((prev) => !prev));
  };

  return (
    <Example title="View Transition" style={{ width: 250, display: 'flex', flexDirection: 'column', gap: 15 }}>
      <div>
        <Button
          {...constructViewTransition({ moveBtn: {} })}
          style={{
            display: 'block',
            marginInline: { left: 0, center: 'auto', right: 'auto 0' }[pos],
            borderRadius: { left: 0, center: 0, right: '17px' }[pos],
            backgroundColor: { left: 'red', center: 'orange', right: 'green' }[pos],
            borderColor: { left: 'orange', center: 'green', right: 'red' }[pos],
            borderStyle: 'solid',
            borderWidth: { left: '10px', center: '5px', right: '3px' }[pos],
            boxShadow: {
              left: 'rgba(255,0,0,.4) -5px 5px, rgba(255,0,0,.3) -10px 10px, rgba(255,0,0,.2) -15px 15px, rgba(255,0,0,.1) -20px 20px, rgba(255,0,0,.05) -25px 25px',
              center:
                'rgba(255,165,0,.4) 0px 5px, rgba(255,165,0,.3) 0px 10px, rgba(255,165,0,.2) 0px 15px, rgba(255,165,0,.1) 0px 20px, rgba(255,165,0,.05) 0px 25px',
              right:
                'rgba(0,128,0,.4) 5px 5px, rgba(0,128,0,.3) 10px 10px, rgba(0,128,0,.2) 15px 15px, rgba(0,128,0,.1) 20px 20px, rgba(0,128,0,.05) 25px 25px',
            }[pos],
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
            {...constructViewTransition({
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
          {...constructViewTransition({ switchBtn: {} })}
          onClick={toggleSwitch}
          style={{ display: 'block', marginInline: 'auto' }}
        >
          {isOn ? 'Switch Off' : 'Switch On'}
        </Button>
      </div>

      <div style={{ display: 'flex', gap: 15 }}>
        {!inSquare && (
          <div
            {...constructViewTransition({ switchSquare: {} })}
            style={{ background: 'red', width: '50%', height: 50 }}
          />
        )}
        <div
          {...constructViewTransition({ switchContainer: {} })}
          style={{ border: '1px solid white', width: '50%', minHeight: 20, height: 'min-content', marginLeft: 'auto' }}
        >
          {inSquare && (
            <div
              {...constructViewTransition({ switchSquare: {} })}
              style={{ background: 'red', width: '100%', height: 50 }}
            />
          )}
        </div>
      </div>
      <Button
        onClick={() =>
          startViewTransition(['switchContainer', 'switchSquare'], { duration: 600 }, () =>
            setInSquare((prev) => !prev)
          )
        }
      >
        Switch
      </Button>
    </Example>
  );
};

export default ViewTransition;
