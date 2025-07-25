import defaults from '../defaults';
import getTruthyArray from '../getTruthyArray';
import { getTransitioned } from '../registry/store';
import captureSnapshot from '../snapshot/captureSnapshot';
import { cancelTransition, finishTransition, getRecordById, getTransitionsById, setupRecord } from '../store';
import getPersistentBounds from '../transition/getPersistentBounds';
import { FalsyArray, Tag, TransitionConfig } from '../types';
import appendPairsToDOM from './appendPairsToDOM';
import applyDynamicStatesToPairs from './applyDynamicStatesToPairs';
import applyMaxZIndexToSnapshotPairs from './applyMaxZIndexToSnapshotPairs';
import applyPersistentBoundsToPairs from './applyPersistentBoundsToPairs';
import applyPositionToRoots from './applyPositionToRoots';
import applyPositionToSnapshotPairs from './applyPositionToSnapshotPairs';
import applyTransitioningRootsToPairs from './applyTransitioningRootsToPairs';
import formSnapshotPairs from './formSnapshotPairs';
import getAllTags from './getAllTags';
import playLayoutTransition from './playLayoutTransition';
import playMutationTransition from './playMutationTransition';
import playPresenceTransition from './playPresenceTransition';
import validateSnapshotPairs from './validateSnapshotPairs';

const startTransition = async (
  tags: FalsyArray<Tag>,
  updateDOM?: () => void | Promise<void>,
  config?: TransitionConfig
) => {
  const validTags = Array.from(new Set(getTruthyArray(tags)));
  const allTags = getAllTags(validTags);

  const persistentBounds = getPersistentBounds(allTags);
  // captureTransitionProgresses(validTags);
  cancelTransition(...allTags);

  const prevSnapshots = validTags.map((tag) => {
    const transitioned = getTransitioned(tag);

    if (!transitioned) {
      return null;
    }

    return captureSnapshot(
      transitioned,
      tag,
      validTags.filter((validTag) => validTag !== tag)
    );
  });

  await updateDOM?.();

  const nextSnapshots = validTags.map((tag) => {
    const transitioned = getTransitioned(tag);

    if (!transitioned) {
      return null;
    }

    return captureSnapshot(
      transitioned,
      tag,
      validTags.filter((validTag) => validTag !== tag)
    );
  });

  const snapshotPairs = formSnapshotPairs(prevSnapshots, nextSnapshots);
  validateSnapshotPairs(snapshotPairs);
  applyTransitioningRootsToPairs(snapshotPairs);
  appendPairsToDOM(snapshotPairs);
  applyDynamicStatesToPairs(snapshotPairs);
  applyPersistentBoundsToPairs(snapshotPairs, persistentBounds);
  applyPositionToSnapshotPairs(snapshotPairs);
  applyMaxZIndexToSnapshotPairs(snapshotPairs);
  const resetRootsPositions = applyPositionToRoots(snapshotPairs);

  config?.onBegin?.();

  const transitionId = setupRecord();

  try {
    for (const pair of snapshotPairs) {
      const storeRecord = getRecordById(transitionId);
      storeRecord[pair.shared.tag] = {};

      if (pair.transitionType === 'mutation') {
        playMutationTransition(pair, storeRecord[pair.shared.tag]);
      } else if (pair.transitionType === 'presence') {
        playPresenceTransition(pair, storeRecord[pair.shared.tag]);
      }

      if (
        pair.prevSnapshot?.transitionOptions.transitionLayout ||
        pair.nextSnapshot?.transitionOptions.transitionLayout
      ) {
        playLayoutTransition(pair, storeRecord[pair.shared.tag]);
      }
    }

    if (defaults.debug) {
      return;
    }

    await Promise.all(getTransitionsById(transitionId).map((transition) => transition.animation.finished));

    finishTransition(transitionId);
    resetRootsPositions();
    config?.onFinish?.();
  } catch (err: unknown) {
    if ((err as Error).name === 'AbortError') {
      resetRootsPositions();
      config?.onCancel?.();
      return;
    }

    throw err;
  }
};

export default startTransition;
