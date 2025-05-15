import { SnapshotPair } from '../types';
import getOverlayRoot from './getOverlayRoot';

const appendPairsToDOM = (pairs: SnapshotPair[]) => {
  const overlayRoot = getOverlayRoot();

  pairs.forEach((pair) => {
    const { prevSnapshot, nextSnapshot } = pair;

    if (pair.transitionType === 'mutation') {
      const { shared } = pair;
      const root = shared.root ?? overlayRoot;
      root.append(pair.image);
    } else if (pair.transitionType === 'presence') {
      const prevRoot = prevSnapshot?.root ?? overlayRoot;
      const nextRoot = nextSnapshot?.root ?? overlayRoot;

      if (pair.prevImage) {
        prevRoot.append(pair.prevImage);
      }

      if (pair.nextImage) {
        nextRoot.append(pair.nextImage);
      }
    }
  });
};

export default appendPairsToDOM;
