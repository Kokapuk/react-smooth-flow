import { getTransitioned } from '../registry/store';
import { Tag } from '../types';

const getAllTags = (tags: Tag[]) => {
  const allTags: Tag[] = [];

  tags.forEach((tag) => {
    const element = getTransitioned(tag);

    if (!element || !element.dataset.transitioned) {
      allTags.push(tag);
      return;
    }

    allTags.push(...element.dataset.transitioned.split(' '));
  });

  return allTags;
};

export default getAllTags;
