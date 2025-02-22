import { constructTransition, startTransition } from '@lib/main';
import cn from 'classnames';
import { useState } from 'react';
import Button from '../../components/Button';
import Example from '../../components/Example';
import styles from './ContentAlignment.module.scss';

const ContentAlignment = () => {
  const [isExpanded, setExpanded] = useState(false);

  return (
    <Example title="Content alignment" style={{ width: 250, height: 300 }}>
      <div className={styles.container}>
        <div
          className={cn(styles.panel, isExpanded && styles.expanded)}
          {...constructTransition({ contentAlignmentPanel: { contentAlign: 'topCenter', duration: 600 } })}
        >
          {isExpanded && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <Button>1</Button>
              <Button>2</Button>
              <Button>3</Button>
            </div>
          )}
          <Button
            onClick={() =>
              startTransition(['contentAlignmentPanel', 'contentAlignmentPanelButton'], () =>
                setExpanded((prev) => !prev)
              )
            }
            {...constructTransition({ contentAlignmentPanelButton: { duration: 600 } })}
          >
            ...
          </Button>
        </div>
      </div>
    </Example>
  );
};

export default ContentAlignment;
