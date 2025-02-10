import elementMatchesAnyTag from './elementMatchesAnyTag';
import getElementByViewTransitionTag from './getElementByViewTransitionTag';
import { activeTransitions } from './store';
import { Snapshot, ViewTransitionProperties } from './types';

const consistentTransitionProperties: (keyof ViewTransitionProperties)[] = [
  'viewTransitionRootTag',
  'avoidMutationTransition',
  'mutationTransitionFadeType',
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
        if (prev.viewTransitionProperties[i] !== next.viewTransitionProperties[i]) {
          throw Error(
            `"${i}" property differ for the previous and the next snapshots. It should never update while snapshots are being captured. View transition tag: ${prev.tag}`
          );
        }
      });
    }

    const pair = [prev, next].filter(Boolean) as Snapshot[];

    pair.forEach((i) => {
      if (!i.viewTransitionRoot) {
        return;
      }

      if (!anyParentMatchesAnyTag(i.viewTransitionRoot, tags)) {
        return;
      }

      throw Error(
        `Snapshot with the tag "${i.tag}" has the custom view transition root, but either the root it self or one of its parents will also be transitioned`
      );
    });

    pair.forEach((i) => {
      if (!i.viewTransitionRoot) {
        return;
      }

      const activeTransitionTags = Object.keys(activeTransitions);

      if (!anyParentMatchesAnyTag(i.viewTransitionRoot, activeTransitionTags)) {
        return;
      }

      throw Error(
        `Snapshot with the tag "${i.tag}" has the custom view transition root, but either the root it self or one of its parents are being transitioned`
      );
    });

    pair.forEach((i) => {
      const activeTransitionTags = Object.keys(activeTransitions);

      activeTransitionTags.forEach((tag) => {
        const viewTransitionTarget = getElementByViewTransitionTag(tag, i.targetElement);

        if (viewTransitionTarget) {
          throw Error(
            `Snapshot with the tag "${i.tag}" has ongoing transition inside for element with the view transition tag "${tag}"`
          );
        }
      });
    });
  });
};

export default validateSnapshotPairs;
