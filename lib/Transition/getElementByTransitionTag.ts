import getElementTransitionMapping from './getElementTransitionMapping';
import { Tag } from './types';

const getElementByTransitionTag = (tag: Tag, parent: Element | Document = document) => {
  const transitionTargets: HTMLElement[] = Array.from(parent.querySelectorAll('[data-transition]'));
  const matchedElements: HTMLElement[] = [];

  for (const transitionTarget of transitionTargets) {
    const transitionsMapping = getElementTransitionMapping(transitionTarget);

    if (!transitionsMapping || !Object.keys(transitionsMapping).includes(tag) || transitionsMapping[tag].disabled) {
      continue;
    }

    matchedElements.push(transitionTarget);
  }

  if (!matchedElements.length) {
    return null;
  } else if (matchedElements.length > 1) {
    throw Error(`Found ${matchedElements.length} elements with tag "${tag}". Transition tag must be unique`);
  } else {
    return matchedElements[0];
  }
};

export default getElementByTransitionTag;
