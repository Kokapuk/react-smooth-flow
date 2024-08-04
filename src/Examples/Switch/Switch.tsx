import Button from '../../components/Button';
import Example from '../../components/Example';
import LayoutTransition from '../../utils/LayoutTransition';
import SwitchTransition from '../../utils/SwitchTransition';
import useDelayedState from '../../utils/useDelayedState';
import styles from './Switch.module.scss';

const Switch = () => {
  const [isOn, setOn] = useDelayedState(false);

  return (
    <Example title="Switch">
      <SwitchTransition
        trigger="transition"
        freeSpaceOnExit
        classes={{
          enter: styles.enter,
          exit: styles.exit,
        }}
      >
        {isOn.relevant && <div className={styles.indicator} />}
      </SwitchTransition>
      <LayoutTransition deps={[isOn.relevant]} delayedDeps={[isOn.delayed]} duration={600}>
        <div>
          <SwitchTransition
            trigger="animation"
            classes={{
              enter: styles.enter,
              exit: styles.exit,
            }}
          >
            <Button key={JSON.stringify(isOn)} className={styles.button} onClick={() => setOn((prev) => !prev)}>
              {isOn.delayed ? 'Switch Off' : 'Switch On'}
            </Button>
          </SwitchTransition>
        </div>
      </LayoutTransition>
    </Example>
  );
};

export default Switch;
