import { flushSync } from 'react-dom';
import applyPositionToSnapshots from './applyPositionToSnapshot';
import cancelViewTransition from './cancelViewTransition';
import captureSnapshot from './captureSnapshot';
import validateSnapshotPairs from './validateSnapshotPairs';
import getElementByViewTransitionTag from './getElementByViewTransitionTag';
import playEnterExitTransition from './playEnterExitTransition';
import playMutationTransition from './playMutationTransition';
import { ViewTransitionConfig } from './types';
import getAllTags from './getAllTags';

const startViewTransition = async (
  tags: string[],
  config: ViewTransitionConfig,
  modifyDOM: () => void | Promise<void>
) => {
  cancelViewTransition(...getAllTags(tags));

  const prevSnapshots = tags.map((i) =>
    captureSnapshot(
      getElementByViewTransitionTag(i),
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
      getElementByViewTransitionTag(i),
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
        const targetElement = (
          nextSnapshot ? getElementByViewTransitionTag(nextSnapshot.tag) : null
        );

        if (
          prevSnapshot &&
          nextSnapshot &&
          !prevSnapshot.viewTransitionProperties.avoidMutationTransition &&
          !nextSnapshot.viewTransitionProperties.avoidMutationTransition
        ) {
          return playMutationTransition(targetElement!, prevSnapshot, nextSnapshot, config);
        } else {
          return playEnterExitTransition(targetElement, prevSnapshot, nextSnapshot, config);
        }
      })
    );

    config.onFinish?.();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.name === 'AbortError') {
      config.onCancel?.();
      return;
    }

    throw err;
  }
};

export default startViewTransition;
