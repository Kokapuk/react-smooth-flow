import { SnapshotPair, Tag } from './types';

const applyTransitioningRootsToPairs = (pairs: SnapshotPair[]) => {
  const rootsByTags: Record<Tag, HTMLElement> = {};

  pairs.forEach((pair) => {
    if (pair.transitionType === 'presence') {
      return;
    }

    const { firstValidSnapshot, image } = pair;

    const dataTransitionRoot = firstValidSnapshot.targetElement.dataset.transitionroot;

    if (dataTransitionRoot) {
      rootsByTags[dataTransitionRoot] = image;
    }
  });

  pairs.forEach((pair) => {
    const { shared, prevSnapshot, nextSnapshot } = pair;

    if (
      !shared.transitionOptions.transitionRootTag ||
      !Object.keys(rootsByTags).includes(shared.transitionOptions.transitionRootTag)
    ) {
      return;
    }

    const transitioningRoot = rootsByTags[shared.transitionOptions.transitionRootTag];

    if (prevSnapshot) {
      prevSnapshot.transitionRoot = transitioningRoot;
    }

    if (nextSnapshot) {
      nextSnapshot.transitionRoot = transitioningRoot;
    }

    shared.transitionRoot = transitioningRoot;
  });
};

export default applyTransitioningRootsToPairs;
