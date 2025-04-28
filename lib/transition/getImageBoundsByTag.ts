import adjustBoundsToRoot from '../snapshot/adjustBoundsToRoot';
import getElementBounds from '../snapshot/getElementBounds';
import { getRecordByTag } from '../store';
import { Tag } from '../types';

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

export default getImageBoundsByTag;
