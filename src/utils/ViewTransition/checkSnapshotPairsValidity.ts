import { Snapshot } from './types';

const checkSnapshotPairsValidity = (
  pairs: {
    prev: Snapshot | null;
    next: Snapshot | null;
  }[]
) => {
  pairs.forEach(({ prev, next }) => {
    if (!prev || !next) {
      return;
    }

    if (
      prev.viewTransitionProperties.useParentAsTransitionRoot !==
      next.viewTransitionProperties.useParentAsTransitionRoot
    ) {
      throw Error(
        `"useParentAsTransitionRoot" property differ for the previous and the next snapshots. It should never update while snapshots are being captured. View transition tag: ${prev.viewTransitionProperties.tag}`
      );
    }
  });
};

export default checkSnapshotPairsValidity;
