import { Snapshot, SnapshotPair } from '../types';

const applyScrollPositionToSnapshot = (snapshot: Snapshot) => {
  const { scrollLeft, scrollTop } = snapshot.dynamicStateData;
  snapshot.targetElementClone.scrollTo({ top: scrollTop, left: scrollLeft, behavior: 'instant' });
};

const applyDynamicStateDataToPairs = (pairs: SnapshotPair[]) => {
  pairs.forEach((pair) => {
    const { prevSnapshot, nextSnapshot } = pair;

    if (prevSnapshot?.dynamicStateData.scrollLeft || prevSnapshot?.dynamicStateData.scrollTop) {
      applyScrollPositionToSnapshot(prevSnapshot);
    }

    if (nextSnapshot?.dynamicStateData.scrollLeft || nextSnapshot?.dynamicStateData.scrollTop) {
      applyScrollPositionToSnapshot(nextSnapshot);
    }
  });
};

export default applyDynamicStateDataToPairs;
