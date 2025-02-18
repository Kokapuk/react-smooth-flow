import { constructTransition, startTransition } from '@lib/main';
import cn from 'classnames';
import { useState } from 'react';
import Button from '../../components/Button';
import Example from '../../components/Example';
import styles from './ContentAlignment.module.scss';

const ContentAlignment = () => {
  const [isExpanded, setExpanded] = useState(false);

  return (
    <Example title="Content alignment" style={{ width: 400, height: 400 }}>
      <div className={styles.container}>
        <div
          className={cn(styles.panel, isExpanded && styles.expanded)}
          {...constructTransition({ contentAlignmentPanel: { contentAlign: 'topCenter' } })}
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
              startTransition(['contentAlignmentPanel', 'contentAlignmentPanelButton'], { duration: 600 }, () =>
                setExpanded((prev) => !prev)
              )
            }
            {...constructTransition({ contentAlignmentPanelButton: {} })}
          >
            ...
          </Button>
        </div>
      </div>
    </Example>
  );
};

export default ContentAlignment;
