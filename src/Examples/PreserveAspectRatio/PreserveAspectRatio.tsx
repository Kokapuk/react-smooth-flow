import { useState } from 'react';
import { flushSync } from 'react-dom';
import Example from '../../components/Example';
import constructViewTransition from '../../utils/ViewTransition/constructViewTransition';
import startViewTransition from '../../utils/ViewTransition/startViewTransition';
import styles from './PreserveAspectRatio.module.scss';

const buttons = [1, 2, 3, 4];

const PreserveAspectRatio = () => {
  const [activeSection, setActiveSection] = useState<number | null>(null);

  return (
    <Example title="Preserve Aspect Ratio" style={{ width: 500 }}>
      <div className={styles.container} {...constructViewTransition({ tag: 'container', contentAlign: 'top right' })}>
        {activeSection !== null && (
          <p className={styles.expandedContent} {...constructViewTransition({ tag: `panel-${activeSection}` })}>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Error accusantium sequi cum minima, enim dolor
            commodi dolore quae? Itaque explicabo velit voluptatibus sint excepturi animi, deserunt laboriosam sit quas
            dolorum?
          </p>
        )}

        <div className={styles.buttonsContainer}>
          {buttons.map((i) => (
            <button
              onClick={() =>
                startViewTransition(['container', ...buttons.map((i) => `panel-${i}`)], { duration: 600 }, () =>
                  flushSync(() => setActiveSection(activeSection === i ? null : i))
                )
              }
              className={styles.button}
              key={i}
              {...(activeSection !== i ? constructViewTransition({ tag: `panel-${i}` }) : null)}
            >
              {i}
            </button>
          ))}
        </div>
      </div>
    </Example>
  );
};

export default PreserveAspectRatio;
