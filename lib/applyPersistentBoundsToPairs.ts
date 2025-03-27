import { Bounds, SnapshotPair, Tag } from './types';

const applyPersistentBoundsToPairs = (pairs: SnapshotPair[], persistentBounds: Record<Tag, Bounds | null>) => {
  pairs.forEach((pair) => {
    if (pair.transitionType === 'mutation') {
      pair.prevSnapshot.bounds = persistentBounds[pair.shared.tag] ?? pair.prevSnapshot.bounds;
    }
  });
};

export default applyPersistentBoundsToPairs;
