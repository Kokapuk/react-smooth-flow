import { activeTransitions } from './store';

const cancelTransition = (...tags: string[]) => {
  tags.forEach((i) => {
    activeTransitions[i]?.forEach((i) => {
      i.transition.cancel();
      i.onCancel();
    });
  });
};

export default cancelTransition;
