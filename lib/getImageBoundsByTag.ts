import getElementBounds from './getElementBounds';
import { activeTransitions } from './store';
import { Tag } from './types';

const getImageBoundsByTag = (tag: Tag) => {
  const activeTransition = activeTransitions[tag];

  if (!activeTransition) {
    return null;
  }

  const activeTransitionPair = activeTransitions[tag][0].snapshotPair;

  if (activeTransitionPair.transitionType === 'mutation') {
    return getElementBounds(activeTransitionPair.image);
  }

  return null;
};

export default getImageBoundsByTag;
