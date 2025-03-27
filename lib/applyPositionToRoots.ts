import { rootHasActiveTransition } from './rootHasActiveTransition';
import { SnapshotPair } from './types';

const applyPositionToRoots = (pairs: SnapshotPair[]) => {
  const uniqueRoots: HTMLElement[] = [];

  for (const { shared } of pairs) {
    if (shared.transitionRoot && !uniqueRoots.includes(shared.transitionRoot)) {
      uniqueRoots.push(shared.transitionRoot);
    }
  }

  uniqueRoots.forEach((root) => {
    const computedStyle = window.getComputedStyle(root);

    if (computedStyle.position !== 'static') {
      return;
    }

    root.setAttribute('data-savedposition', root.style.position);
    root.style.setProperty('position', 'relative', 'important');
  });

  return () => {
    uniqueRoots.forEach((root) => {
      if (rootHasActiveTransition(root)) {
        return;
      }

      if (root.dataset.savedposition === undefined) {
        return;
      }

      root.style.setProperty('position', root.dataset.savedposition);
      root.removeAttribute('data-savedposition');
    });
  };
};

export default applyPositionToRoots;
