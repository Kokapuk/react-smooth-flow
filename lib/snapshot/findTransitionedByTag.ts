import { Tag } from '../types';

const findTransitionedByTag = (tag: Tag, parent: Element | Document = document) => {
  const elements = parent.querySelectorAll('[data-transitioned]') as NodeListOf<HTMLElement>;

  for (const element of elements) {
    if (element.dataset.transitioned!.match(new RegExp(`${tag}(?:\\s|$)`))) {
      return element;
    }
  }

  return null;
};

export default findTransitionedByTag;
