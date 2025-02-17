import elementMatchesAnyTag from './elementMatchesAnyTag';
import { activeTransitions } from './store';
import { Snapshot, TransitionProperties } from './types';

const consistentTransitionProperties: (keyof TransitionProperties)[] = [
  'transitionRootTag',
  'avoidMutationTransition',
  'mutationTransitionType',
];

const anyParentMatchesAnyTag = (element: HTMLElement, tags: string[]) => {
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
  tags: string[]
) => {
  pairs.forEach(({ prev, next }) => {
    if (prev && next) {
      consistentTransitionProperties.forEach((i) => {
        if (prev.transitionProperties[i] !== next.transitionProperties[i]) {
          throw Error(
            `"${i}" property differ for previous and next snapshots. It should never update while snapshots are being captured. Transition tag: ${prev.tag}`
          );
        }
      });
    }

    const pair = [prev, next].filter(Boolean) as Snapshot[];

    pair.forEach((i) => {
      if (!i.transitionRoot) {
        return;
      }

      if (!anyParentMatchesAnyTag(i.transitionRoot, tags)) {
        return;
      }

      throw Error(
        `Snapshot with tag "${i.tag}" has custom transition root, but either root it self or one of its parents will also be transitioned`
      );
    });

    pair.forEach((i) => {
      if (!i.transitionRoot) {
        return;
      }

      const activeTransitionTags = Object.keys(activeTransitions);

      if (!anyParentMatchesAnyTag(i.transitionRoot, activeTransitionTags)) {
        return;
      }

      throw Error(
        `Snapshot with tag "${i.tag}" has custom transition root, but either root it self or one of its parents are being transitioned`
      );
    });

    // pair.forEach((i) => {
    //   const activeTransitionTags = Object.keys(activeTransitions);

    //   activeTransitionTags.forEach((tag) => {
    //     const transitionTarget = getElementByTransitionTag(tag, i.targetElement);

    //     if (transitionTarget) {
    //       throw Error(
    //         `Snapshot with tag "${i.tag}" has ongoing transition inside for element with transition tag "${tag}"`
    //       );
    //     }
    //   });
    // });
  });
};

export default validateSnapshotPairs;
