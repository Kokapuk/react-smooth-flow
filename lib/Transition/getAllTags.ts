import getElementByTransitionTag from './getElementByTransitionTag';
import getElementTransitionMapping from './getElementTransitionMapping';
import { Tag } from './types';

const getAllTags = (tags: Tag[]) => {
  const allTags: Tag[] = [];

  tags.forEach((tag) => {
    const element = getElementByTransitionTag(tag);

    if (!element) {
      allTags.push(tag);
      return;
    }

    const transitionMapping = getElementTransitionMapping(element);

    if (!transitionMapping) {
      allTags.push(tag);
      return;
    }

    const allElementTags = Object.keys(transitionMapping);
    allTags.push(...allElementTags);
  });

  return allTags;
};

export default getAllTags;
