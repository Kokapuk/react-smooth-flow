import { activeTransitions } from './store';
import { Tag } from './types';

const finishTransitions = (...tags: Tag[]) => {
  tags.forEach((tag) => {
    activeTransitions[tag]?.forEach((transition) => {
      transition.cleanup();
    });

    delete activeTransitions[tag];
  });
};

export default finishTransitions;
