import getElementTransitionMapping from './getElementTransitionMapping';

const elementMatchesAnyTag = (element: HTMLElement, tags: string[]) => {
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
