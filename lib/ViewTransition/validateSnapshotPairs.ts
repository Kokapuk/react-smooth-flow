import elementMatchesAnyTag from './elementMatchesAnyTag';
import { Snapshot, ViewTransitionProperties } from './types';

const consistentTransitionProperties: (keyof ViewTransitionProperties)[] = [
  'viewTransitionRootTag',
  'avoidMutationTransition',
  'mutationTransitionFadeType',
];

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
        if (prev.viewTransitionProperties[i] !== next.viewTransitionProperties[i]) {
          throw Error(
            `"${i}" property differ for the previous and the next snapshots. It should never update while snapshots are being captured. View transition tag: ${prev.tag}`
          );
        }
      });
    }

    [prev, next].filter(Boolean).forEach((i) => {
      if (!i!.viewTransitionRoot) {
        return;
      }

      const anyParentMatchesAnyTag = (element: HTMLElement) => {
        if (elementMatchesAnyTag(element, tags)) {
          return true;
        }

        if (!element.parentElement || element.tagName === 'body') {
          return false;
        }

        return anyParentMatchesAnyTag(element.parentElement);
      };

      if (!anyParentMatchesAnyTag(i!.viewTransitionRoot)) {
        return;
      }

      throw Error(
        `Snapshot with the tag "${
          i!.tag
        }" has the custom view transition root, but either the root it self or one of its parents will also be transitioned`
      );
    });
  });
};

export default validateSnapshotPairs;
