import { CONSISTENT_TRANSITION_PROPERTIES } from './config';
import elementMatchesAnyTag from './elementMatchesAnyTag';
import { activeTransitions } from './store';
import { Snapshot, Tag } from './types';

const anyParentMatchesAnyTag = (element: HTMLElement, tags: Tag[]) => {
  if (elementMatchesAnyTag(element, tags)) {
    return true;
  }

  if (!element.parentElement || element.tagName === 'body') {
    return false;
  }

  return anyParentMatchesAnyTag(element.parentElement, tags);
};

const validateSnapshotPairs = (
  pairs: {
    prev: Snapshot | null;
    next: Snapshot | null;
  }[],
  tags: Tag[]
) => {
  pairs.forEach(({ prev, next }) => {
    if (prev && next) {
      CONSISTENT_TRANSITION_PROPERTIES.forEach((property) => {
        if (prev.transitionProperties[property] !== next.transitionProperties[property]) {
          throw Error(
            `"${property}" property differ for previous and next snapshots. It should never update while snapshots are being captured. Transition tag: ${prev.tag}`
          );
        }
      });
    }

    const pair = [prev, next].filter(Boolean) as Snapshot[];

    pair.forEach((snapshot) => {
      if (!snapshot.transitionRoot) {
        return;
      }

      if (!anyParentMatchesAnyTag(snapshot.transitionRoot, tags)) {
        return;
      }

      throw Error(
        `Snapshot with tag "${snapshot.tag}" has custom transition root, but either root it self or one of its parents will also be transitioned`
      );
    });

    pair.forEach((snapshot) => {
      if (!snapshot.transitionRoot) {
        return;
      }

      const activeTransitionTags = Object.keys(activeTransitions);

      if (!anyParentMatchesAnyTag(snapshot.transitionRoot, activeTransitionTags)) {
        return;
      }

      throw Error(
        `Snapshot with tag "${snapshot.tag}" has custom transition root, but either root it self or one of its parents are being transitioned`
      );
    });

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
