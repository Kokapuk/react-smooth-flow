import { rootHasActiveTransition } from './rootHasActiveTransition';
import { Snapshot } from './types';

const applyPositionToRoots = (pairs: { prev: Snapshot | null; next: Snapshot | null }[]) => {
  const uniqueRoots: HTMLElement[] = [];

  for (const { prev: prevSnapshot, next: nextSnapshot } of pairs) {
    if (prevSnapshot?.transitionRoot && !uniqueRoots.includes(prevSnapshot.transitionRoot)) {
      uniqueRoots.push(prevSnapshot.transitionRoot);
    }
    if (nextSnapshot?.transitionRoot && !uniqueRoots.includes(nextSnapshot.transitionRoot)) {
      uniqueRoots.push(nextSnapshot.transitionRoot);
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
