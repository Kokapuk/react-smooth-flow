import {
  CONSISTENT_MUTATION_PAIR_SNAPSHOT_PROPERTIES,
  CONSISTENT_SNAPSHOT_PROPERTIES,
  CONSISTENT_TRANSITION_OPTIONS,
} from '../defaults';
import { SnapshotPair } from '../types';

const validateSnapshotPairs = (pairs: SnapshotPair[]) => {
  pairs.forEach((pair) => {
    const { prevSnapshot, nextSnapshot, transitionType } = pair;

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

      if (transitionType === 'mutation') {
        CONSISTENT_MUTATION_PAIR_SNAPSHOT_PROPERTIES.forEach((property) => {
          if (prevSnapshot[property] !== nextSnapshot[property]) {
            throw Error(
              `"${property}" snapshot property differ for previous and next snapshots and pair use "mutation" transition type. It should never update while snapshots are being captured for that type of transition. Transition tag: ${prevSnapshot.tag}`
            );
          }
        });
      }
    }
  });
};

export default validateSnapshotPairs;
