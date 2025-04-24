import getImageBoundsByTag from './getImageBoundsByTag';
import { Bounds, Tag } from '../types';

const getPersistentBounds = (tags: Tag[]) => {
  const persistentBounds: Record<Tag, Bounds | null> = Object.fromEntries(
    tags.map((tag) => [tag, getImageBoundsByTag(tag)])
  );

  return persistentBounds;
};

export default getPersistentBounds;
