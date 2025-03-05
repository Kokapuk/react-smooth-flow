import getElementByTransitionTag from './getElementByTransitionTag';
import getElementTransitionMapping from './getElementTransitionMapping';
import { Tag } from './types';

const getAllTags = (tags: Tag[]) => {
  const allTags: Tag[] = [];

  tags.forEach((i) => {
    const element = getElementByTransitionTag(i);

    if (!element) {
      allTags.push(i);
      return;
    }

    const transitionMapping = getElementTransitionMapping(element);

    if (!transitionMapping) {
      allTags.push(i);
      return;
    }

    const allElementTags = Object.keys(transitionMapping);
    allTags.push(...allElementTags);
  });

  return allTags;
};

export default getAllTags;
