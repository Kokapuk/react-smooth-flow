import { rootHasActiveTransition } from './rootHasActiveTransition';
import { SnapshotPair } from './types';

const applyPositionToRoots = (pairs: SnapshotPair[]) => {
  const uniqueRoots: HTMLElement[] = [];

  for (const { shared } of pairs) {
    if (shared.root && !uniqueRoots.includes(shared.root)) {
      uniqueRoots.push(shared.root);
    }
  }

  uniqueRoots.forEach((root) => {
    const computedStyle = window.getComputedStyle(root);

    if (computedStyle.position !== 'static') {
      return;
    }

    root.dataset.savedposition = root.style.position;
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
      delete root.dataset.savedposition;
    });
  };
};

export default applyPositionToRoots;
