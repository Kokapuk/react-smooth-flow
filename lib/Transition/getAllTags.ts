import getElementByTransitionTag from './getElementByTransitionTag';
import getElementTransitionMapping from './getElementTransitionMapping';

const getAllTags = (tags: string[]) => {
  const allTags: string[] = [];

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
