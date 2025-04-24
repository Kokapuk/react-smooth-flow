import { Tag } from '../types';

const findTransitionedByTag = (tag: Tag, parent: Element | Document = document) => {
  const targets = parent.querySelectorAll('[data-transitioned]') as NodeListOf<HTMLElement>;

  for (const target of targets) {
    if (target.dataset.transitioned!.match(new RegExp(`${tag}(?:\\s|$)`))) {
      return target;
    }
  }

  return null;
};

export default findTransitionedByTag;
