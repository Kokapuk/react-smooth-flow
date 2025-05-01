import { Tag } from '../types';
import findTransitionedByTag from './findTransitionedByTag';

const hideElementWithTag = (tag: Tag, parent: HTMLElement) => {
  const element = findTransitionedByTag(tag, parent);

  if (!element) {
    return;
  }

  element.style.setProperty('opacity', '0', 'important');
  element.style.setProperty('transition', 'none', 'important');
};

export default hideElementWithTag;
