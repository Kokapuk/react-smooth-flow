import adjustBoundsToRoot from './adjustBoundsToRoot';
import getElementBounds from './getElementBounds';
import { getRecordByTag } from './store';
import { Tag } from './types';

const getImageBoundsByTag = (tag: Tag) => {
  const record = getRecordByTag(tag);

  if (!record) {
    return null;
  }

  const activeTransitionPair = record[tag][0].snapshotPair;

  if (activeTransitionPair.transitionType === 'presence') {
    return null;
  }

  const bounds = getElementBounds(activeTransitionPair.image);

  if (activeTransitionPair.shared.transitionRoot) {
    adjustBoundsToRoot(bounds, activeTransitionPair.shared.transitionRoot);
  }

  return bounds;
};

export default getImageBoundsByTag;
