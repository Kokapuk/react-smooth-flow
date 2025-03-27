import { activeTransitions } from './store';

export const rootHasActiveTransition = (root: HTMLElement) => {
  const transitions = Object.keys(activeTransitions).flatMap((tag) => activeTransitions[tag]);

  return transitions.some((transition) => transition.snapshotPair.shared.transitionRoot === root);
};
