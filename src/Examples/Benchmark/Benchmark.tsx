import { startTransition } from '@lib/main';
import Binder from '@lib/registry/Binder';
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
    startTransition(tags);
    setResult(Date.now() - startTime);
  };

  const startBenchmarkOnRoot = () => {
    const startTime = Date.now();
    startTransition(['benchmarkGrid']);
    setResult(Date.now() - startTime);
  };

  return (
    <Example title="Benchmark">
      <Binder root="benchmarkRoot">
        <div className={styles.wrapper}>
          <Binder
            transitions={{
              benchmarkGrid: {
                forcePresenceTransition: true,
                enterKeyframes: { opacity: [0, 0, 1], scale: [0.5, 0.5, 1] },
                exitKeyframes: 'reversedEnter',
                transitionRootTag: 'benchmarkRoot',
                duration: 2000,
              },
            }}
          >
            <div className={styles.grid}>
              {cells.map((i) => (
                <Binder
                  key={i}
                  transitions={{
                    [`${i}-benchmark`]: {
                      forcePresenceTransition: true,
                      enterKeyframes: { opacity: [0, 0, 1], scale: [0.5, 0.5, 1], background: ['red', 'red'] },
                      exitKeyframes: 'reversedEnter',
                      transitionRootTag: 'benchmarkRoot',
                      duration: 2000,
                      relevantStyleProperties: ['display', 'place-items'],
                    },
                  }}
                >
                  <div className={styles.cell}>{i}</div>
                </Binder>
              ))}
            </div>
          </Binder>
        </div>
      </Binder>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
        <Button onClick={startBenchmark}>Run</Button>
        <Button onClick={startBenchmarkOnRoot}>Run on grid</Button>
        <p>{result}ms</p>
      </div>
    </Example>
  );
};

export default Benchmark;
