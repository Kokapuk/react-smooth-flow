import { TransitionSnapshot, ViewTransitionConfig } from './types';
import getElementByViewTransitionTag from './getElementByViewTransitionTag';
import getSnapshot from './getSnapshot';
import playEnterExitTransition from './playEnterExitTransition';
import playMutationTransition from './playMutationTransition';

const activeTransitions: { [key: string]: TransitionSnapshot[] } = {};

const startViewTransition = async (tags: string[], config: ViewTransitionConfig, modifyDom: () => void) => {
  tags.forEach((i) => {
    activeTransitions[i]?.forEach((i) => {
      i.transition.cancel();

      i.prevSnapshotImage?.remove();
      i.nextSnapshotImage?.remove();

      if (i.targetElement && i.targetResetVisibility !== undefined) {
        i.targetElement.style.visibility = i.targetResetVisibility;
      }
    });
  });

  const prevSnapshots = tags.map((i) => getSnapshot(getElementByViewTransitionTag(i) as HTMLElement | null));
  await modifyDom();
  const nextSnapshots = tags.map((i) => getSnapshot(getElementByViewTransitionTag(i) as HTMLElement | null));

  const pairs = prevSnapshots.map((i, index) => ({ prev: i, next: nextSnapshots[index] }));

  for (const { prev: prevSnapshot, next: nextSnapshot } of pairs) {
    const targetElement = (
      nextSnapshot ? getElementByViewTransitionTag(nextSnapshot.viewTransitionProperties.tag) : null
    ) as HTMLElement | null;

    if (prevSnapshot && nextSnapshot) {
      playMutationTransition(targetElement!, prevSnapshot, nextSnapshot, config, activeTransitions);
    } else if (!prevSnapshot || !nextSnapshot) {
      playEnterExitTransition(targetElement, prevSnapshot, nextSnapshot, config, activeTransitions);
    }
  }
};

export default startViewTransition;
