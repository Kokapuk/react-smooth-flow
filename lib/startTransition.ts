import { flushSync } from 'react-dom';
import applyMaxZIndexToSnapshotPairs from './applyMaxZIndexToSnapshotPairs';
import applyPersistentBoundsToPairs from './applyPersistentBoundsToPairs';
import applyPositionToRoots from './applyPositionToRoots';
import applyPositionToSnapshotPairs from './applyPositionToSnapshotPairs';
import cancelTransition from './cancelTransition';
import captureSnapshot from './captureSnapshot';
import finishTransitions from './finishTransitions';
import getAllTags from './getAllTags';
import getElementByTransitionTag from './getElementByTransitionTag';
import getImageBoundsByTag from './getImageBoundsByTag';
import getSnapshotPairs from './getSnapshotPairs';
import getTruthyArray from './getTruthyArray';
import playMutationTransition from './playMutationTransition';
import playPresenceTransition from './playPresenceTransition';
import { Bounds, FalsyArray, Tag, TransitionConfig } from './types';
import validateSnapshotPairs from './validateSnapshotPairs';

const startTransition = async (tags: FalsyArray<Tag>, updateDOM?: () => void, config?: TransitionConfig) => {
  const finalConfig = { flushSync: true, ...config };

  const validTags = getTruthyArray(tags);
  const persistentBounds: Record<Tag, Bounds | null> = Object.fromEntries(
    validTags.map((tag) => [tag, getImageBoundsByTag(tag)])
  );
  cancelTransition(...getAllTags(validTags));

  const prevSnapshots = validTags.map((targetTag) =>
    captureSnapshot(
      getElementByTransitionTag(targetTag),
      targetTag,
      validTags.filter((tag) => tag !== targetTag)
    )
  );

  if (updateDOM) {
    if (finalConfig.flushSync) {
      flushSync(updateDOM);
    } else {
      updateDOM();
    }
  } else {
    await (() => {})();
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
  applyPersistentBoundsToPairs(snapshotParis, persistentBounds);
  applyPositionToSnapshotPairs(snapshotParis);
  applyMaxZIndexToSnapshotPairs(snapshotParis);
  const resetRootsPositions = applyPositionToRoots(snapshotParis);

  finalConfig.onBegin?.();

  try {
    await Promise.all(
      snapshotParis.map((pair) => {
        if (pair.transitionType === 'mutation') {
          return playMutationTransition(pair);
        } else if (pair.transitionType === 'presence') {
          return playPresenceTransition(pair);
        }
      })
    );

    finishTransitions(...validTags);
    resetRootsPositions();
    finalConfig.onFinish?.();
  } catch (err: any) {
    if (err.name === 'AbortError') {
      resetRootsPositions();
      finalConfig.onCancel?.();
      return;
    }

    throw err;
  }
};

export default startTransition;
