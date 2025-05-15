import { SnapshotPair, Tag } from '../types';
import validateSnapshotPairs from './validateSnapshotPairs';

const applyTransitioningRootsToPairs = (pairs: SnapshotPair[]) => {
  const rootsByTags: Record<Tag, { prev: HTMLElement | null; next: HTMLElement | null }> = {};

  pairs.forEach((pair) => {
    const { firstValidSnapshot } = pair;
    const dataRoot = firstValidSnapshot.target.dataset.root;

    if (!dataRoot) {
      return;
    }

    if (pair.transitionType === 'presence') {
      const { prevImage, nextImage } = pair;
      rootsByTags[dataRoot] = { prev: prevImage, next: nextImage };
    } else {
      const { image } = pair;
      rootsByTags[dataRoot] = { prev: image, next: image };
    }
  });

  pairs.forEach((pair) => {
    const { shared, prevSnapshot, nextSnapshot, transitionType } = pair;

    if (!shared.transitionOptions.root || !Object.keys(rootsByTags).includes(shared.transitionOptions.root)) {
      return;
    }

    const transitioningRoots = rootsByTags[shared.transitionOptions.root];

    if (prevSnapshot && transitioningRoots.prev) {
      prevSnapshot.root = transitioningRoots.prev;
    }

    if (nextSnapshot && transitioningRoots.next) {
      nextSnapshot.root = transitioningRoots.next;
    }

    if (transitionType === 'mutation') {
      shared.root = transitioningRoots.prev;
      validateSnapshotPairs([pair]);
    }
  });
};

export default applyTransitioningRootsToPairs;
