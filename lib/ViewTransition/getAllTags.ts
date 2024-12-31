import getElementByViewTransitionTag from './getElementByViewTransitionTag';
import getElementViewTransitionMapping from './getElementViewTransitionMapping';

const getAllTags = (tags: string[]) => {
  const allTags: string[] = [];

  tags.forEach((i) => {
    const element = getElementByViewTransitionTag(i);

    if (!element) {
      return;
    }

    const viewTransitionMapping = getElementViewTransitionMapping(element);

    if (!viewTransitionMapping) {
      return;
    }

    allTags.push(...Object.keys(viewTransitionMapping));
  });

  return allTags;
};

export default getAllTags;