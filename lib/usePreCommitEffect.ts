import { DependencyList, useMemo, useRef } from 'react';

const usePreCommitEffect = (effect: (isInitialRender: boolean) => void | (() => void), deps?: DependencyList) => {
  const initialRender = useRef(true);
  const cleanup = useRef<(() => void) | void | null>(null);

  useMemo(() => {
    if (cleanup.current) {
      cleanup.current();
    }

    cleanup.current = effect(initialRender.current);

    if (initialRender.current) {
      initialRender.current = false;
    }
  }, deps ?? [{}]);
};

export default usePreCommitEffect;
