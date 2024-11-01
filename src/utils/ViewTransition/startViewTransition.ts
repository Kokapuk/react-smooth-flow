import applyPositionToSnapshots from './applyPositionToSnapshot';
import cancelViewTransition from './cancelViewTransition';
import getElementByViewTransitionTag from './getElementByViewTransitionTag';
import getSnapshot from './getSnapshot';
import playEnterExitTransition from './playEnterExitTransition';
import playMutationTransition from './playMutationTransition';
import { ViewTransitionConfig } from './types';

const startViewTransition = async (tags: string[], config: ViewTransitionConfig, modifyDom: () => void) => {
  cancelViewTransition(...tags);

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

  pairs.forEach(({ prev, next }) => {
    if (!prev || !next) {
      return;
    }

    if (
      prev.viewTransitionProperties.useParentAsTransitionRoot !==
      next.viewTransitionProperties.useParentAsTransitionRoot
    ) {
      throw Error(
        `"useParentAsTransitionRoot" property differ for previous and next snapshots. It should never update while snapshots are being captured. View transition tag: ${prev.viewTransitionProperties.tag}`
      );
    }
  });

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
      playMutationTransition(targetElement!, prevSnapshot, nextSnapshot, config);
    } else {
      playEnterExitTransition(targetElement, prevSnapshot, nextSnapshot, config);
    }
  }
};

export default startViewTransition;
