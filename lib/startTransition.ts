import { flushSync } from 'react-dom';
import applyMaxZIndexToSnapshotPairs from './applyMaxZIndexToSnapshotPairs';
import applyPositionToRoots from './applyPositionToRoots';
import applyPositionToSnapshotPairs from './applyPositionToSnapshotPairs';
import cancelTransition from './cancelTransition';
import captureSnapshot from './captureSnapshot';
import finishTransitions from './finishTransitions';
import getAllTags from './getAllTags';
import getElementByTransitionTag from './getElementByTransitionTag';
import getSnapshotPairs from './getSnapshotPairs';
import getTruthyArray from './getTruthyArray';
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

  const snapshotParis = getSnapshotPairs(prevSnapshots, nextSnapshots);
  validateSnapshotPairs(snapshotParis, validTags);
  applyPositionToSnapshotPairs(snapshotParis);
  applyMaxZIndexToSnapshotPairs(snapshotParis);
  const resetRootsPositions = applyPositionToRoots(snapshotParis);

  config?.onBegin?.();

  try {
    await Promise.all(
      snapshotParis.map((pair) => {
        if (pair.transitionType === 'mutation') {
          return playMutationTransition(pair);
        } else if (pair.transitionType === 'enterExit') {
          return playEnterExitTransition(pair);
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
