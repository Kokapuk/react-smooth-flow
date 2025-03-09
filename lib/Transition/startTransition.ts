import { flushSync } from 'react-dom';
import applyMaxZIndexToSnapshots from './applyMaxZIndexToSnapshots';
import applyPositionToRoots from './applyPositionToRoots';
import applyPositionToSnapshots from './applyPositionToSnapshots';
import cancelTransition from './cancelTransition';
import captureSnapshot from './captureSnapshot';
import finishTransitions from './finishTransitions';
import getAllTags from './getAllTags';
import getElementByTransitionTag from './getElementByTransitionTag';
import getTruthyArray from './getTruthyArray';
import isMotionReduced from './isMotionReduced';
import playEnterExitTransition from './playEnterExitTransition';
import playMutationTransition from './playMutationTransition';
import { FalsyArray, Tag, TransitionConfig } from './types';
import validateSnapshotPairs from './validateSnapshotPairs';

const startTransition = async (
  tags: FalsyArray<Tag>,
  modifyDOM: () => void | Promise<void>,
  config?: TransitionConfig
) => {
  const validTags = getTruthyArray(tags);
  cancelTransition(...getAllTags(validTags));

  const prevSnapshots = validTags.map((targetTag) =>
    captureSnapshot(
      getElementByTransitionTag(targetTag),
      targetTag,
      validTags.filter((tag) => tag !== targetTag)
    )
  );

  if (config?.noFlushSync) {
    await modifyDOM();
  } else {
    await flushSync(modifyDOM);
  }

  const nextSnapshots = validTags.map((targetTag) =>
    captureSnapshot(
      getElementByTransitionTag(targetTag),
      targetTag,
      validTags.filter((tag) => tag !== targetTag)
    )
  );

  const pairs = prevSnapshots
    .map((i, index) => ({ prev: i, next: nextSnapshots[index] }))
    .filter(
      (pair) =>
        pair.prev?.transitionProperties.ignoreReducedMotion ||
        pair.next?.transitionProperties.ignoreReducedMotion ||
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

        if (prevSnapshot && nextSnapshot && !prevSnapshot.transitionProperties.avoidMutationTransition) {
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
