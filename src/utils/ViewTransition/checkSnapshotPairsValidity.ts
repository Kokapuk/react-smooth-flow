import elementMatchesAnyTag from './elementMatchesAnyTag';
import { Snapshot } from './types';

const checkSnapshotPairsValidity = (
  pairs: {
    prev: Snapshot | null;
    next: Snapshot | null;
  }[],
  tags: string[]
) => {
  pairs.forEach(({ prev, next }) => {
    if (
      prev &&
      next &&
      prev.viewTransitionProperties.useParentAsTransitionRoot !==
        next.viewTransitionProperties.useParentAsTransitionRoot
    ) {
      throw Error(
        `"useParentAsTransitionRoot" property differ for the previous and the next snapshots. It should never update while snapshots are being captured. View transition tag: ${prev.viewTransitionProperties.tag}`
      );
    }

    [prev, next].filter(Boolean).forEach((i) => {
      if (!i!.transitionRoot) {
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

      if (!anyParentMatchesAnyTag(i!.transitionRoot)) {
        return;
      }

      throw Error(
        `Snapshot with the tag "${
          i!.viewTransitionProperties.tag
        }" has the property "useParentAsTransitionRoot" set to "true", but one of its parents will also be transitioned`
      );
    });
  });
};

export default checkSnapshotPairsValidity;
