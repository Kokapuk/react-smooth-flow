import getElementTransitionMapping from './getElementTransitionMapping';
import { Tag } from './types';

const getElementByTransitionTag = (tag: Tag, parent: Element | Document = document) => {
  const transitionTargets = parent.querySelectorAll('[data-transition]') as NodeListOf<HTMLElement>;
  const matchedElements: HTMLElement[] = [];

  transitionTargets.forEach((transitionTarget) => {
    const transitionsMapping = getElementTransitionMapping(transitionTarget);

    if (!transitionsMapping || !Object.keys(transitionsMapping).includes(tag) || transitionsMapping[tag].disabled) {
      return;
    }

    matchedElements.push(transitionTarget);
  });

  if (!matchedElements.length) {
    return null;
  } else if (matchedElements.length > 1) {
    throw Error(`Found ${matchedElements.length} elements with tag "${tag}". Transition tag must be unique`);
  } else {
    return matchedElements[0];
  }
};

export default getElementByTransitionTag;
