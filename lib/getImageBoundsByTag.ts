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

  return getElementBounds(activeTransitionPair.image);
};

export default getImageBoundsByTag;
