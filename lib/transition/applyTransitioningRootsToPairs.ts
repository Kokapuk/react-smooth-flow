import { SnapshotPair, Tag } from '../types';

const applyTransitioningRootsToPairs = (pairs: SnapshotPair[]) => {
  const rootsByTags: Record<Tag, HTMLElement> = {};

  pairs.forEach((pair) => {
    if (pair.transitionType === 'presence') {
      return;
    }

    const { firstValidSnapshot, image } = pair;

    const dataRoot = firstValidSnapshot.target.dataset.root;

    if (dataRoot) {
      rootsByTags[dataRoot] = image;
    }
  });

  pairs.forEach((pair) => {
    const { shared, prevSnapshot, nextSnapshot } = pair;

    if (!shared.transitionOptions.root || !Object.keys(rootsByTags).includes(shared.transitionOptions.root)) {
      return;
    }

    const transitioningRoot = rootsByTags[shared.transitionOptions.root];

    if (prevSnapshot) {
      prevSnapshot.root = transitioningRoot;
    }

    if (nextSnapshot) {
      nextSnapshot.root = transitioningRoot;
    }

    shared.root = transitioningRoot;
  });
};

export default applyTransitioningRootsToPairs;
