import { activeTransitions } from './store';
import { Tag } from './types';

const finishTransitions = (...tags: Tag[]) => {
  tags.forEach((i) => {
    activeTransitions[i]?.forEach((i) => {
      i.onCancel();
    });

    delete activeTransitions[i];
  });
};

export default finishTransitions;
