import { flushSync } from 'react-dom';
import applyPositionToRoots from './applyPositionToRoots';
import applyPositionToSnapshots from './applyPositionToSnapshots';
import cancelTransition from './cancelTransition';
import captureSnapshot from './captureSnapshot';
import finishTransitions from './finishTransitions';
import getAllTags from './getAllTags';
import getElementByTransitionTag from './getElementByTransitionTag';
import isMotionReduced from './isMotionReduced';
import playEnterExitTransition from './playEnterExitTransition';
import playMutationTransition from './playMutationTransition';
import { TransitionConfig } from './types';
import validateSnapshotPairs from './validateSnapshotPairs';

const startTransition = async (tags: string[], modifyDOM: () => void | Promise<void>, config?: TransitionConfig) => {
  cancelTransition(...getAllTags(tags));

  const prevSnapshots = tags.map((i) =>
    captureSnapshot(
      getElementByTransitionTag(i),
      i,
      tags.filter((j) => j !== i)
    )
  );

  if (config?.noFlushSync) {
    await modifyDOM();
  } else {
    await flushSync(modifyDOM);
  }

  const nextSnapshots = tags.map((i) =>
    captureSnapshot(
      getElementByTransitionTag(i),
      i,
      tags.filter((j) => j !== i)
    )
  );

  const pairs = prevSnapshots
    .map((i, index) => ({ prev: i, next: nextSnapshots[index] }))
    .filter(
      (i) =>
        i.prev?.transitionProperties.ignoreReducedMotion ||
        i.next?.transitionProperties.ignoreReducedMotion ||
        !isMotionReduced()
    );
  validateSnapshotPairs(pairs, tags);
  applyPositionToSnapshots(pairs);
  const resetRootsPositions = applyPositionToRoots(pairs);

  config?.onBegin?.();

  try {
    await Promise.all(
      pairs.map(({ prev: prevSnapshot, next: nextSnapshot }) => {
        const targetElement = nextSnapshot ? getElementByTransitionTag(nextSnapshot.tag) : null;

        if (
          prevSnapshot &&
          nextSnapshot &&
          !prevSnapshot.transitionProperties.avoidMutationTransition &&
          !nextSnapshot.transitionProperties.avoidMutationTransition
        ) {
          return playMutationTransition(targetElement!, prevSnapshot, nextSnapshot);
        } else {
          return playEnterExitTransition(targetElement, prevSnapshot, nextSnapshot);
        }
      })
    );

    finishTransitions(...tags);
    resetRootsPositions();
    config?.onFinish?.();
  } catch (err: any) {
    if (err.name === 'AbortError') {
      resetRootsPositions();
      config?.onCancel?.();
      return;
    }

    throw err;
  }
};

export default startTransition;
