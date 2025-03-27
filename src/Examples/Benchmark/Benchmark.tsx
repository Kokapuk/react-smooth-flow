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
    startTransition(tags, () => {});
    setResult(Date.now() - startTime);
  };

  const startBenchmarkOnRoot = () => {
    const startTime = Date.now();
    startTransition(['benchmarkGrid'], () => {});
    setResult(Date.now() - startTime);
  };

  return (
    <Example title="Benchmark">
      <div className={styles.wrapper} {...constructTransitionRoot('benchmarkRoot')}>
        <div
          className={styles.grid}
          {...constructTransition({
            benchmarkGrid: {
              forcePresenceTransition: true,
              enterKeyframes: { opacity: [0, 0, 1], scale: [0.5, 0.5, 1] },
              exitKeyframes: 'reversedEnter',
              transitionRootTag: 'benchmarkRoot',
              duration: 2000,
            },
          })}
        >
          {cells.map((i) => (
            <div
              className={styles.cell}
              key={i}
              {...constructTransition({
                [`${i}-benchmark`]: {
                  forcePresenceTransition: true,
                  enterKeyframes: { opacity: [0, 0, 1], scale: [0.5, 0.5, 1] },
                  exitKeyframes: 'reversedEnter',
                  transitionRootTag: 'benchmarkRoot',
                  duration: 2000,
                  relevantStyleProperties: ['display', 'place-items'],
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
        <Button onClick={startBenchmarkOnRoot}>Run on grid</Button>
        <p>{result}ms</p>
      </div>
    </Example>
  );
};

export default Benchmark;
