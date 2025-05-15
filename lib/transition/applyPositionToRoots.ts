import { SnapshotPair } from '../types';
import { rootHasActiveTransition } from './rootHasActiveTransition';

const applyPositionToRoots = (pairs: SnapshotPair[]) => {
  const uniqueRoots: HTMLElement[] = [];

  for (const { prevSnapshot, nextSnapshot } of pairs) {
    if (prevSnapshot?.root && !uniqueRoots.includes(prevSnapshot.root)) {
      uniqueRoots.push(prevSnapshot.root);
    }

    if (nextSnapshot?.root && !uniqueRoots.includes(nextSnapshot.root)) {
      uniqueRoots.push(nextSnapshot.root);
    }
  }

  uniqueRoots.forEach((root) => {
    const computedStyle = window.getComputedStyle(root);

    if (computedStyle.position !== 'static') {
      return;
    }

    root.dataset.savedposition = `${root.style.getPropertyPriority('position')} ${root.style.getPropertyPriority(
      'position'
    )}`;
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

      const [savedPositionValue, savedPositionPriority] = root.dataset.savedposition.split(' ');

      root.style.setProperty('position', savedPositionValue, savedPositionPriority);
      delete root.dataset.savedposition;
    });
  };
};

export default applyPositionToRoots;
