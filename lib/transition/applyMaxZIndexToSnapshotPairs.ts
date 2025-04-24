import { SnapshotPair } from '../types';

const applyMaxZIndexToSnapshotPairs = (pairs: SnapshotPair[]) => {
  const pairsMaxZIndex = pairs.map(({ prevSnapshot, nextSnapshot }) =>
    Math.max(prevSnapshot?.totalZIndex ?? -1, nextSnapshot?.totalZIndex ?? -1)
  );
  const maxZIndex = Math.max(...pairsMaxZIndex);

  pairs.forEach((pair) => {
    if (pair.transitionType === 'mutation') {
      pair.image.style.zIndex = maxZIndex.toString();
    } else if (pair.transitionType === 'presence') {
      if (pair.prevImage) {
        pair.prevImage.style.zIndex = maxZIndex.toString();
      }

      if (pair.nextImage) {
        pair.nextImage.style.zIndex = maxZIndex.toString();
      }
    }
  });
};

export default applyMaxZIndexToSnapshotPairs;
