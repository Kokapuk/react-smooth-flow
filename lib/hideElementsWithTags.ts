import findTransitionedByTag from './findTransitionedByTag';
import { Tag } from './types';

const hideElementsWithTags = (tags: Tag[], targetElement: HTMLElement) => {
  tags.forEach((tag) => {
    const element = findTransitionedByTag(tag, targetElement);

    if (!element) {
      return;
    }

    element.style.setProperty('opacity', '0', 'important');
    element.style.setProperty('transition', 'none', 'important');
  });
};

export default hideElementsWithTags;
