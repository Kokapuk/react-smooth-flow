import getElementViewTransitionMapping from './getElementViewTransitionMapping';

const elementMatchesAnyTag = (element: HTMLElement, tags: string[]) => {
  const viewTransitionMapping = getElementViewTransitionMapping(element);

  if (!viewTransitionMapping) {
    return false;
  }

  const viewTransitionTags = Object.keys(viewTransitionMapping);

  for (const tag of viewTransitionTags) {
    if (tags.includes(tag)) {
      return true;
    }
  }

  return false;
};

export default elementMatchesAnyTag;
