import { activeTransitions } from './store';
import { Tag } from './types';

const finishTransitions = (...tags: Tag[]) => {
  tags.forEach((tag) => {
    activeTransitions[tag]?.forEach((transition) => {
      transition.onCancel();
    });

    delete activeTransitions[tag];
  });
};

export default finishTransitions;
