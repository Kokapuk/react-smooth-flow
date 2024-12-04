import getElementViewTransitionMapping from './getElementViewTransitionMapping';

const getElementByViewTransitionTag = (tag: string, parent: Element | Document = document) => {
  const viewTransitionTargets = parent.querySelectorAll('[data-viewtransition]');

  for (const viewTransitionTarget of viewTransitionTargets) {
    const viewTransitionsMapping = getElementViewTransitionMapping(viewTransitionTarget as HTMLElement);

    if (!viewTransitionsMapping) {
      continue;
    }

    if (Object.keys(viewTransitionsMapping).includes(tag)) {
      return viewTransitionTarget as HTMLElement;
    }
  }

  return null;
};

export default getElementByViewTransitionTag;
