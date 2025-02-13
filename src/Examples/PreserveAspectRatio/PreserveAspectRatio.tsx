import { constructTransition, startTransition } from '@lib/main';
import { useState } from 'react';
import Example from '../../components/Example';
import styles from './PreserveAspectRatio.module.scss';

const buttons = [1, 2, 3, 4];
const materialDesignEmphasizedEasing =
  'linear(0, 0.002, 0.01 3.6%, 0.034, 0.074 9.1%, 0.128 11.4%, 0.194 13.4%, 0.271 15%, 0.344 16.1%, 0.544, 0.66 20.6%, 0.717 22.4%, 0.765 24.6%, 0.808 27.3%, 0.845 30.4%, 0.883 35.1%, 0.916 40.6%, 0.942 47.2%, 0.963 55%, 0.979 64%, 0.991 74.4%, 0.998 86.4%, 1)';
// https://linear-easing-generator.netlify.app/?codeType=svg&code=M+0%2C0%0AC+0.05%2C+0%2C+0.133333%2C+0.06%2C+0.166666%2C+0.4%0AC+0.208333%2C+0.82%2C+0.25%2C+1%2C+1%2C+1&simplify=0.0017&round=3

const PreserveAspectRatio = () => {
  const [activePanel, setActivePanel] = useState<number | null>(null);

  return (
    <Example title="Preserve Aspect Ratio" style={{ width: 500 }}>
      <div className={styles.container} {...constructTransition({ container: { contentAlign: 'top right' } })}>
        {activePanel !== null && (
          <p
            className={styles.panel}
            data-panelnumber={activePanel}
            {...constructTransition({ [`panel-${activePanel}`]: { mutationTransitionType: 'sequential' } })}
          >
            <button
              style={{ float: 'right', height: 22, width: 22 }}
              onClick={() =>
                startTransition(
                  ['container', `panel-${activePanel}`],
                  {
                    duration: 750,
                    easing: materialDesignEmphasizedEasing,
                  },
                  () => setActivePanel(null)
                )
              }
            >
              X
            </button>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Error accusantium sequi cum minima, enim dolor
            commodi dolore quae? Itaque explicabo velit voluptatibus sint excepturi animi, deserunt laboriosam sit quas
            dolorum?
          </p>
        )}

        <div className={styles.buttonsContainer}>
          {buttons.map((i) => (
            <button
              onClick={() =>
                startTransition(
                  ['container', activePanel ? `panel-${activePanel}` : null, `panel-${i}`].filter(Boolean) as string[],
                  {
                    duration: 750,
                    easing: materialDesignEmphasizedEasing,
                  },
                  () => setActivePanel(i)
                )
              }
              className={styles.button}
              key={i}
              style={{ visibility: activePanel === i ? 'hidden' : undefined }}
              {...(activePanel !== i
                ? constructTransition({ [`panel-${i}`]: { mutationTransitionType: 'sequential' } })
                : null)}
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
