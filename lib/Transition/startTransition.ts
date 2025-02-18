import { flushSync } from 'react-dom';
import applyPositionToSnapshots from './applyPositionToSnapshot';
import cancelTransition from './cancelTransition';
import captureSnapshot from './captureSnapshot';
import getAllTags from './getAllTags';
import getElementByTransitionTag from './getElementByTransitionTag';
import isMotionReduced from './isMotionReduced';
import playEnterExitTransition from './playEnterExitTransition';
import playMutationTransition from './playMutationTransition';
import { TransitionConfig } from './types';
import validateSnapshotPairs from './validateSnapshotPairs';

const startTransition = async (tags: string[], config: TransitionConfig, modifyDOM: () => void | Promise<void>) => {
  cancelTransition(...getAllTags(tags));

  if (!config.ignoreReducedMotion && isMotionReduced()) {
    modifyDOM();
    return;
  }

  const prevSnapshots = tags.map((i) =>
    captureSnapshot(
      getElementByTransitionTag(i),
      i,
      tags.filter((j) => j !== i)
    )
  );

  if (config.noFlushSync) {
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

  const pairs = prevSnapshots.map((i, index) => ({ prev: i, next: nextSnapshots[index] }));
  validateSnapshotPairs(pairs, tags);
  applyPositionToSnapshots(pairs);

  config.onBegin?.();

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
          return playMutationTransition(targetElement!, prevSnapshot, nextSnapshot, config);
        } else {
          return playEnterExitTransition(targetElement, prevSnapshot, nextSnapshot, config);
        }
      })
    );

    config.onFinish?.();
  } catch (err: any) {
    if (err.name === 'AbortError') {
      config.onCancel?.();
      return;
    }

    throw err;
  }
};

export default startTransition;
