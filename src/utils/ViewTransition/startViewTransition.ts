import applyPositionToSnapshots from './applyPositionToSnapshot';
import getElementByViewTransitionTag from './getElementByViewTransitionTag';
import getSnapshot from './getSnapshot';
import playEnterExitTransition from './playEnterExitTransition';
import playMutationTransition from './playMutationTransition';
import { TransitionSnapshot, ViewTransitionConfig } from './types';

const activeTransitions: { [key: string]: TransitionSnapshot[] } = {};

const startViewTransition = async (tags: string[], config: ViewTransitionConfig, modifyDom: () => void) => {
  tags.forEach((i) => {
    activeTransitions[i]?.forEach((i) => {
      i.transition.cancel();

      i.prevSnapshotImage?.remove();
      i.nextSnapshotImage?.remove();

      if (i.targetElement && i.targetResetStyles) {
        i.targetElement.style.opacity = i.targetResetStyles.opacity;
        i.targetElement.style.transition = i.targetResetStyles.transition;
      }
    });
  });

  const prevSnapshots = tags.map((i) =>
    getSnapshot(
      getElementByViewTransitionTag(i) as HTMLElement | null,
      tags.filter((j) => j !== i),
      config
    )
  );
  await modifyDom();
  const nextSnapshots = tags.map((i) =>
    getSnapshot(
      getElementByViewTransitionTag(i) as HTMLElement | null,
      tags.filter((j) => j !== i),
      config
    )
  );

  const pairs = prevSnapshots.map((i, index) => ({ prev: i, next: nextSnapshots[index] }));
  applyPositionToSnapshots(pairs);

  for (const { prev: prevSnapshot, next: nextSnapshot } of pairs) {
    const targetElement = (
      nextSnapshot ? getElementByViewTransitionTag(nextSnapshot.viewTransitionProperties.tag) : null
    ) as HTMLElement | null;

    if (
      prevSnapshot &&
      nextSnapshot &&
      !prevSnapshot.viewTransitionProperties.avoidMutationTransition &&
      !nextSnapshot.viewTransitionProperties.avoidMutationTransition
    ) {
      playMutationTransition(targetElement!, prevSnapshot, nextSnapshot, config, activeTransitions);
    } else {
      playEnterExitTransition(targetElement, prevSnapshot, nextSnapshot, config, activeTransitions);
    }
  }
};

export default startViewTransition;
