import getElementTransitionMapping from './getElementTransitionMapping';

const getElementByTransitionTag = (tag: string, parent: Element | Document = document) => {
  const transitionTargets: HTMLElement[] = Array.from(parent.querySelectorAll('[data-transition]'));
  const matchedElements: HTMLElement[] = [];

  for (const transitionTarget of transitionTargets) {
    const transitionsMapping = getElementTransitionMapping(transitionTarget);

    if (!transitionsMapping) {
      continue;
    }

    if (Object.keys(transitionsMapping).includes(tag)) {
      matchedElements.push(transitionTarget);
    }
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
