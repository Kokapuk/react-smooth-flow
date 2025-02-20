import { constructTransition, constructTransitionRoot, startTransition } from '@lib/main';
import { useState } from 'react';
import Button from '../../components/Button';
import Example from '../../components/Example';
import styles from './Benchmark.module.scss';

const cells = Array.from({ length: 100 }).map((_, index) => index + 1);
const tags = cells.map((i) => `${i}-benchmark`);

const Benchmark = () => {
  const [result, setResult] = useState(0);

  const startBenchmark = () => {
    const startTime = Date.now();
    startTransition(tags, { duration: 2000 }, () => {});
    setResult(Date.now() - startTime);
  };

  return (
    <Example title="Benchmark">
      <div className={styles.wrapper}>
        <div className={styles.grid} {...constructTransitionRoot('benchmarkRoot')}>
          {cells.map((i) => (
            <div
              className={styles.cell}
              key={i}
              {...constructTransition({
                [`${i}-benchmark`]: {
                  avoidMutationTransition: true,
                  enterKeyframes: { opacity: [0, 0, 1], scale: [0.5, 0.5, 1] },
                  exitKeyframes: 'reversedEnter',
                  transitionRootTag: 'benchmarkRoot',
                },
              })}
            >
              {i}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
        <Button onClick={startBenchmark}>Run</Button>
        <p>{result}ms</p>
      </div>
    </Example>
  );
};

export default Benchmark;
