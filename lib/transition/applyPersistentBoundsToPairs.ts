import { Bounds, SnapshotPair, Tag } from '../types';

const applyPersistentBoundsToPairs = (pairs: SnapshotPair[], persistentBounds: Record<Tag, Bounds | null>) => {
  pairs.forEach((pair) => {
    if (pair.transitionType === 'mutation' && pair.prevSnapshot.transitionOptions.persistBounds) {
      const tags = Object.keys(pair.prevSnapshot.transitionMapping);

      for (const tag of tags) {
        const imageBounds = persistentBounds[tag];

        if (imageBounds) {
          pair.prevSnapshot.bounds = imageBounds;
          break;
        }
      }
    }
  });
};

export default applyPersistentBoundsToPairs;
