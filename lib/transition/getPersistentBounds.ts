import adjustBoundsToRoot from '@lib/snapshot/adjustBoundsToRoot';
import getElementBounds from '@lib/snapshot/getElementBounds';
import { getRecordByTag } from '@lib/store';
import { Bounds, Tag } from '../types';

const getImageBoundsByTag = (tag: Tag) => {
  const record = getRecordByTag(tag);

  if (!record) {
    return null;
  }

  const activeTransitionPair = record[tag][0].snapshotPair;

  if (activeTransitionPair.transitionType === 'presence') {
    return null;
  }

  const { shared, image } = activeTransitionPair;
  const bounds = getElementBounds(image, shared.transitionOptions.captureTransform);

  if (shared.root) {
    adjustBoundsToRoot(bounds, shared.root);
  }

  return bounds;
};

const getPersistentBounds = (tags: Tag[]) => {
  const persistentBounds: Record<Tag, Bounds | null> = Object.fromEntries(
    tags.map((tag) => [tag, getImageBoundsByTag(tag)])
  );

  return persistentBounds;
};

export default getPersistentBounds;
