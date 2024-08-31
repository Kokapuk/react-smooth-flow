import { ViewTransitionConfig } from '.';
import getElementByViewTransitionTag from './getElementByViewTransitionTag';
import getSnapshot from './getSnapshot';
import playEnterExitTransition from './playEnterExitTransition';
import playMutationTransition from './playMutationTransition';

const startViewTransition = async (tags: string[], config: ViewTransitionConfig, modifyDom: () => void) => {
  const prevSnapshots = tags.map((i) => getSnapshot(getElementByViewTransitionTag(i) as HTMLElement | null));
  await modifyDom();
  const nextSnapshots = tags.map((i) => getSnapshot(getElementByViewTransitionTag(i) as HTMLElement | null));

  const pairs = prevSnapshots.map((i, index) => ({ prev: i, next: nextSnapshots[index] }));

  for (const { prev: prevSnapshot, next: nextSnapshot } of pairs) {
    const targetElement = (
      nextSnapshot ? getElementByViewTransitionTag(nextSnapshot.viewTransitionProperties.tag) : null
    ) as HTMLElement | null;

    if (prevSnapshot && nextSnapshot) {
      playMutationTransition(targetElement!, prevSnapshot, nextSnapshot, config);
    } else if (!prevSnapshot || !nextSnapshot) {
      playEnterExitTransition(targetElement, prevSnapshot, nextSnapshot, config);
    }
  }
};

export default startViewTransition;
