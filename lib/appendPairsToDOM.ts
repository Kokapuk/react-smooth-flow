import getOverlayRoot from './getOverlayRoot';
import { SnapshotPair } from './types';

const appendPairsToDOM = (pairs: SnapshotPair[]) => {
  const overlayRoot = getOverlayRoot();

  pairs.forEach((pair) => {
    const root = pair.shared.root ?? overlayRoot;

    if (pair.transitionType === 'mutation') {
      root.append(pair.image);
    } else if (pair.transitionType === 'presence') {
      if (pair.prevImage) {
        root.append(pair.prevImage);
      }

      if (pair.nextImage) {
        root.append(pair.nextImage);
      }
    }
  });
};

export default appendPairsToDOM;
