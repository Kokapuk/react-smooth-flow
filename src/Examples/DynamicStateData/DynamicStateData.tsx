import { Binder, startTransition } from '@lib/main';
import { useState } from 'react';
import Button from '../../components/Button';
import Example from '../../components/Example';
import styles from './DynamicStateData.module.scss';

const DynamicStateData = () => {
  const [isToggled, setToggled] = useState(false);

  return (
    <Example title="Dynamic State Data" style={{ width: 250 }}>
      <Binder transitions={{ scrollArea: { duration: 600 } }}>
        <div className={styles.scrollArea} style={{ marginLeft: isToggled ? 'auto' : 0 }}>
          {Array.from({ length: 25 }).map((_, index) => (
            <Button key={index} style={{ flexShrink: 0, width: 75 }}>
              {index}
            </Button>
          ))}
        </div>
      </Binder>
      <Button
        onClick={() => startTransition(['scrollArea'], () => setToggled((prev) => !prev))}
        style={{ marginTop: 25 }}
      >
        Toggle
      </Button>
    </Example>
  );
};

export default DynamicStateData;
