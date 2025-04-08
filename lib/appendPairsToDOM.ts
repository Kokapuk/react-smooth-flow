import getTransitionRoot from './getTransitionRoot';
import { SnapshotPair } from './types';

const appendPairsToDOM = (pairs: SnapshotPair[]) => {
  const overlayRoot = getTransitionRoot();

  pairs.forEach((pair) => {
    const transitionRoot = pair.shared.transitionRoot ?? overlayRoot;

    if (pair.transitionType === 'mutation') {
      transitionRoot.append(pair.image);
    } else if (pair.transitionType === 'presence') {
      if (pair.prevImage) {
        transitionRoot.append(pair.prevImage);
      }

      if (pair.nextImage) {
        transitionRoot.append(pair.nextImage);
      }
    }
  });
};

export default appendPairsToDOM;
