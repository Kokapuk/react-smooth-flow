import getElementTransitionMapping from './getElementTransitionMapping';
import { Tag } from './types';

const elementMatchesAnyTag = (element: HTMLElement, tags: Tag[]) => {
  const transitionMapping = getElementTransitionMapping(element);

  if (!transitionMapping) {
    return false;
  }

  const transitionTags = Object.keys(transitionMapping);

  for (const tag of transitionTags) {
    if (tags.includes(tag)) {
      return true;
    }
  }

  return false;
};

export default elementMatchesAnyTag;
