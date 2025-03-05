import { Snapshot } from './types';

const applyMaxZIndexToSnapshots = (pairs: { prev: Snapshot | null; next: Snapshot | null }[]) => {
  const pairsMaxZIndex = pairs.map(({ prev, next }) => Math.max(prev?.totalZIndex ?? -1, next?.totalZIndex ?? -1));
  const maxZIndex = Math.max(...pairsMaxZIndex);

  pairs
    .flatMap((i) => [i.prev, i.next])
    .forEach((i) => {
      if (!i) {
        return;
      }

      i.image.style.zIndex = maxZIndex.toString();
    });
};

export default applyMaxZIndexToSnapshots;
