import getElementViewTransitionMapping from './getElementViewTransitionMapping';

const getElementByViewTransitionTag = (tag: string, parent: Element | Document = document) => {
  const viewTransitionTargets = parent.querySelectorAll('[data-viewtransition]');

  const matchedElements: HTMLElement[] = [];

  for (const viewTransitionTarget of viewTransitionTargets) {
    const viewTransitionsMapping = getElementViewTransitionMapping(viewTransitionTarget as HTMLElement);

    if (!viewTransitionsMapping) {
      continue;
    }

    if (Object.keys(viewTransitionsMapping).includes(tag)) {
      matchedElements.push(viewTransitionTarget as HTMLElement);
    }
  }

  if (!matchedElements.length) {
    return null;
  } else if (matchedElements.length > 1) {
    throw Error(`View transition tag must be unique. Found ${matchedElements.length} elements with the "${tag}" tag.`);
  } else {
    return matchedElements[0];
  }
};

export default getElementByViewTransitionTag;
