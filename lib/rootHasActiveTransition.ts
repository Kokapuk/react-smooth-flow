import { getAllTransitions } from './store';

export const rootHasActiveTransition = (root: HTMLElement) => {
  const transitions = getAllTransitions();

  return transitions.some((transition) => transition.snapshotPair.shared.transitionRoot === root);
};
