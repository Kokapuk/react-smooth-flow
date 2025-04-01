import { CONSISTENT_SNAPSHOT_PROPERTIES, CONSISTENT_TRANSITION_OPTIONS } from './defaults';
import { SnapshotPair, Tag } from './types';

// const anyParentMatchesAnyTag = (element: HTMLElement, tags: Tag[]) => {
//   if (elementMatchesAnyTag(element, tags)) {
//     return true;
//   }

//   if (!element.parentElement || element.tagName === 'body') {
//     return false;
//   }

//   return anyParentMatchesAnyTag(element.parentElement, tags);
// };

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

    // const pair = [prevSnapshot, nextSnapshot].filter(Boolean) as Snapshot[];

    // pair.forEach((snapshot) => {
    //   if (!snapshot.transitionRoot) {
    //     return;
    //   }

    //   if (!anyParentMatchesAnyTag(snapshot.transitionRoot, tags)) {
    //     return;
    //   }

    //   throw Error(
    //     `Snapshot with tag "${snapshot.tag}" has custom transition root, but either root it self or one of its parents will also be transitioned`
    //   );
    // });

    // pair.forEach((snapshot) => {
    //   if (!snapshot.transitionRoot) {
    //     return;
    //   }

    //   const activeTransitionTags = Object.keys(activeTransitions);

    //   if (!anyParentMatchesAnyTag(snapshot.transitionRoot, activeTransitionTags)) {
    //     return;
    //   }

    //   throw Error(
    //     `Snapshot with tag "${snapshot.tag}" has custom transition root, but either root it self or one of its parents are being transitioned`
    //   );
    // });

    // pair.forEach((snapshot) => {
    //   const activeTransitionTags = Object.keys(activeTransitions);

    //   activeTransitionTags.forEach((tag) => {
    //     const transitionTarget = getElementByTransitionTag(tag, snapshot.targetElement);

    //     if (transitionTarget) {
    //       throw Error(
    //         `Snapshot with tag "${snapshot.tag}" has ongoing transition inside for element with transition tag "${tag}"`
    //       );
    //     }
    //   });
    // });
  });
};

export default validateSnapshotPairs;
