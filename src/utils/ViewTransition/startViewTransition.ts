import applyPositionToSnapshots from './applyPositionToSnapshot';
import cancelViewTransition from './cancelViewTransition';
import captureSnapshot from './captureSnapshot';
import checkSnapshotPairsValidity from './checkSnapshotPairsValidity';
import getElementByViewTransitionTag from './getElementByViewTransitionTag';
import playEnterExitTransition from './playEnterExitTransition';
import playMutationTransition from './playMutationTransition';
import { ViewTransitionConfig } from './types';

const startViewTransition = async (tags: string[], config: ViewTransitionConfig, modifyDOM: () => void) => {
  cancelViewTransition(...tags);

  const prevSnapshots = tags.map((i) =>
    captureSnapshot(
      getElementByViewTransitionTag(i) as HTMLElement | null,
      tags.filter((j) => j !== i),
      config
    )
  );
  await modifyDOM();
  const nextSnapshots = tags.map((i) =>
    captureSnapshot(
      getElementByViewTransitionTag(i) as HTMLElement | null,
      tags.filter((j) => j !== i),
      config
    )
  );

  const pairs = prevSnapshots.map((i, index) => ({ prev: i, next: nextSnapshots[index] }));
  checkSnapshotPairsValidity(pairs, tags);
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
