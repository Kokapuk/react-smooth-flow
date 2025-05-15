import { getAllTransitions } from '../store';

export const rootHasActiveTransition = (root: HTMLElement) => {
  const transitions = getAllTransitions();

  return transitions.some(
    ({ snapshotPair: { prevSnapshot, nextSnapshot } }) =>
      (prevSnapshot?.root && prevSnapshot.root === root) || (nextSnapshot?.root && nextSnapshot.root === root)
  );
};
