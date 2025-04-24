import { CONSISTENT_SNAPSHOT_PROPERTIES, CONSISTENT_TRANSITION_OPTIONS } from '../defaults';
import { SnapshotPair, Tag } from '../types';

const validateSnapshotPairs = (pairs: SnapshotPair[], _tags: Tag[]) => {
  pairs.forEach(({ prevSnapshot, nextSnapshot }) => {
    if (prevSnapshot && nextSnapshot) {
      CONSISTENT_TRANSITION_OPTIONS.forEach((property) => {
        if (prevSnapshot.transitionOptions[property] !== nextSnapshot.transitionOptions[property]) {
          throw Error(
            `"${property}" transition property differ for previous and next snapshots. It should never update while snapshots are being captured. Transition tag: ${prevSnapshot.tag}`
          );
        }
      });

      CONSISTENT_SNAPSHOT_PROPERTIES.forEach((property) => {
        if (prevSnapshot[property] !== nextSnapshot[property]) {
          throw Error(
            `"${property}" snapshot property differ for previous and next snapshots. It should never update while snapshots are being captured. Transition tag: ${prevSnapshot.tag}`
          );
        }
      });
    }
  });
};

export default validateSnapshotPairs;
