import { Binder, startTransition } from '@lib/main';
import { useState } from 'react';
import Button from '../../components/Button';
import Example from '../../components/Example';
import Switch from '../../components/Switch';
import styles from './DynamicStates.module.scss';

const DynamicStates = () => {
  const [captureDynamicStates, setCaptureDynamicStates] = useState<0 | -1>(-1);
  const [isToggled, setToggled] = useState(false);

  return (
    <Example title="Dynamic State Data" style={{ width: 350 }}>
      <div className={styles.switchContainer}>
        <Switch
          checked={captureDynamicStates === -1}
          onChange={(e) => setCaptureDynamicStates(e.currentTarget.checked ? -1 : 0)}
        />
        <p>Should capture dynamic states?</p>
      </div>
      <div className={styles.wrapper}>
        <Binder transitions={{ scrollArea: { duration: 600, captureDynamicStatesDepth: captureDynamicStates } }}>
          <div className={styles.scrollArea} style={{ marginLeft: isToggled ? 'auto' : 0 }}>
            {Array.from({ length: 25 }).map((_, index) => (
              <Button key={index}>{index}</Button>
            ))}
          </div>
        </Binder>
        <Binder transitions={{ input: { duration: 600, captureDynamicStatesDepth: captureDynamicStates } }}>
          <input
            className={styles.input}
            placeholder="Type something"
            type="text"
            style={{ marginLeft: isToggled ? 'auto' : 0 }}
          />
        </Binder>
        <Binder transitions={{ textarea: { duration: 600, captureDynamicStatesDepth: captureDynamicStates } }}>
          <textarea
            className={styles.input}
            placeholder="Type something"
            style={{ marginLeft: isToggled ? 'auto' : 0 }}
          />
        </Binder>
        <Binder transitions={{ checkbox: { duration: 600, captureDynamicStatesDepth: captureDynamicStates } }}>
          <input className={styles.checkbox} type="checkbox" style={{ marginLeft: isToggled ? 'auto' : 0 }} />
        </Binder>
        <Binder transitions={{ radio: { duration: 600, captureDynamicStatesDepth: captureDynamicStates } }}>
          <div className={styles.radios} style={{ marginLeft: isToggled ? 'auto' : 0 }}>
            <input className={styles.checkbox} type="radio" name="test" />
            <input className={styles.checkbox} type="radio" name="test" />
          </div>
        </Binder>
        <Binder transitions={{ select: { duration: 600, captureDynamicStatesDepth: captureDynamicStates } }}>
          <select className={styles.select} name="select" style={{ marginLeft: isToggled ? 'auto' : 0 }}>
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
        </Binder>
      </div>
      <div className={styles.buttonContainer}>
        <Button
          onClick={() =>
            startTransition(['scrollArea', 'input', 'textarea', 'checkbox', 'radio', 'select'], () =>
              setToggled((prev) => !prev)
            )
          }
        >
          Toggle
        </Button>
      </div>
    </Example>
  );
};

export default DynamicStates;
