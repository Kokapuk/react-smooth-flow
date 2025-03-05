import { flushSync } from 'react-dom';
import applyMaxZIndexToSnapshots from './applyMaxZIndexToSnapshots';
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
import { FalsyArray, Tag, TransitionConfig } from './types';
import validateSnapshotPairs from './validateSnapshotPairs';
import getTruthyArray from './getTruthyArray';

const startTransition = async (
  tags: FalsyArray<Tag>,
  modifyDOM: () => void | Promise<void>,
  config?: TransitionConfig
) => {
  const validTags = getTruthyArray(tags);
  cancelTransition(...getAllTags(validTags));

  const prevSnapshots = validTags.map((i) =>
    captureSnapshot(
      getElementByTransitionTag(i),
      i,
      validTags.filter((j) => j !== i)
    )
  );

  if (config?.noFlushSync) {
    await modifyDOM();
  } else {
    await flushSync(modifyDOM);
  }

  const nextSnapshots = validTags.map((i) =>
    captureSnapshot(
      getElementByTransitionTag(i),
      i,
      validTags.filter((j) => j !== i)
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
  validateSnapshotPairs(pairs, validTags);
  applyPositionToSnapshots(pairs);
  applyMaxZIndexToSnapshots(pairs);
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

    finishTransitions(...validTags);
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
