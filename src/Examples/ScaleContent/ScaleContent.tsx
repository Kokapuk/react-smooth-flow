import constructTransition from '@lib/constructTransition';
import startTransition from '@lib/startTransition';
import { TransitionOptions } from '@lib/types';
import { useState } from 'react';
import Button from '../../components/Button';
import Example from '../../components/Example';
import Icon from './Icon';
import styles from './ScaleContent.module.scss';

const ToggleTarget = ({ tag, transitionOptions }: { tag: string; transitionOptions: TransitionOptions }) => {
  const [isExpanded, setExpanded] = useState(false);

  return (
    <div className={styles.wrapper}>
      <Button
        className={styles.button}
        onClick={() => startTransition([tag], () => setExpanded((prev) => !prev))}
        {...constructTransition({ [tag]: transitionOptions })}
      >
        <Icon height={isExpanded ? 156 : 64} width={isExpanded ? 156 : 64} />
      </Button>
    </div>
  );
};

const ScaleContent = () => {
  return (
    <Example title="Scale Content" style={{ height: 260 }}>
      <div className={styles.container}>
        <ToggleTarget tag="resizeTarget" transitionOptions={{ duration: 800 }} />
        <ToggleTarget tag="scaleResizeTarget" transitionOptions={{ duration: 800, scaleContent: true }} />
      </div>
    </Example>
  );
};

export default ScaleContent;
