import { flushSync } from 'react-dom';
import appendPairsToDOM from './appendPairsToDOM';
import applyMaxZIndexToSnapshotPairs from './applyMaxZIndexToSnapshotPairs';
import applyPersistentBoundsToPairs from './applyPersistentBoundsToPairs';
import applyPositionToRoots from './applyPositionToRoots';
import applyPositionToSnapshotPairs from './applyPositionToSnapshotPairs';
import applyTransitioningRootsToPairs from './applyTransitioningRootsToPairs';
import captureSnapshot from './captureSnapshot';
import defaults from './defaults';
import getAllTags from './getAllTags';
import getElementByTransitionTag from './getElementByTransitionTag';
import getImageBoundsByTag from './getImageBoundsByTag';
import getSnapshotPairs from './getSnapshotPairs';
import getTruthyArray from './getTruthyArray';
import playLayoutTransition from './playLayoutTransition';
import playMutationTransition from './playMutationTransition';
import playPresenceTransition from './playPresenceTransition';
import { cancelTransition, finishTransition, getRecordById, getTransitionsById, setupRecord } from './store';
import { Bounds, FalsyArray, Tag, TransitionConfig } from './types';
import validateSnapshotPairs from './validateSnapshotPairs';

const startTransition = async (tags: FalsyArray<Tag>, updateDOM?: () => void, config?: TransitionConfig) => {
  const finalConfig = { flushSync: true, ...config };

  const validTags = getTruthyArray(tags);
  const allTags = getAllTags(validTags);

  const persistentBounds: Record<Tag, Bounds | null> = Object.fromEntries(
    allTags.map((tag) => [tag, getImageBoundsByTag(tag)])
  );
  cancelTransition(...allTags);

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
  applyTransitioningRootsToPairs(snapshotParis);
  appendPairsToDOM(snapshotParis);
  applyPersistentBoundsToPairs(snapshotParis, persistentBounds);
  applyPositionToSnapshotPairs(snapshotParis);
  applyMaxZIndexToSnapshotPairs(snapshotParis);
  const resetRootsPositions = applyPositionToRoots(snapshotParis);

  finalConfig.onBegin?.();

  const transitionId = setupRecord();

  try {
    for (const pair of snapshotParis) {
      const storeRecord = getRecordById(transitionId);
      storeRecord[pair.shared.tag] = []

      if (pair.transitionType === 'mutation') {
        playMutationTransition(pair, storeRecord[pair.shared.tag]);
      } else if (pair.transitionType === 'presence') {
        playPresenceTransition(pair, storeRecord[pair.shared.tag]);
      }

      if (pair.shared.transitionOptions.transitionLayout) {
        playLayoutTransition(pair, storeRecord[pair.shared.tag]);
      }
    }

    if (defaults.debug) {
      return;
    }

    await Promise.all(getTransitionsById(transitionId).map((transition) => transition.animation.finished));

    finishTransition(transitionId);
    resetRootsPositions();
    finalConfig.onFinish?.();
  } catch (err: unknown) {
    if ((err as Error).name === 'AbortError') {
      resetRootsPositions();
      finalConfig.onCancel?.();
      return;
    }

    throw err;
  }
};

export default startTransition;
