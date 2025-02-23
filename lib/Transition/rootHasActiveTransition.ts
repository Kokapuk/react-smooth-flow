import { activeTransitions } from './store';

export const rootHasActiveTransition = (root: HTMLElement) => {
  const snapshots = Object.keys(activeTransitions).flatMap((tag) => activeTransitions[tag]);

  return snapshots.some((i) => i.snapshot?.transitionRoot === root);
};
