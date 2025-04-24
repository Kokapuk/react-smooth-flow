import { SnapshotPair } from './types';

const applyDynamicStateDataToPairs = (pairs: SnapshotPair[]) => {
  pairs.forEach((pair) => {
    const { prevSnapshot, nextSnapshot } = pair;
    
    if (prevSnapshot?.dynamicStateData.scrollLeft || prevSnapshot?.dynamicStateData.scrollTop) {
      const { scrollLeft, scrollTop } = prevSnapshot.dynamicStateData;
      prevSnapshot.targetElementClone.scrollTo({ top: scrollTop, left: scrollLeft, behavior: 'instant' });
    }

    if (nextSnapshot?.dynamicStateData.scrollLeft || nextSnapshot?.dynamicStateData.scrollTop) {
      const { scrollLeft, scrollTop } = nextSnapshot.dynamicStateData;
      nextSnapshot.targetElementClone.scrollTo({ top: scrollTop, left: scrollLeft, behavior: 'instant' });
    }
  });
};

export default applyDynamicStateDataToPairs;
