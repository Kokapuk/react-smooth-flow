import { Tag } from './types';

const constructTransitionRoot = (tag: Tag) => ({
  'data-transitionroot': tag,
});

export default constructTransitionRoot;
