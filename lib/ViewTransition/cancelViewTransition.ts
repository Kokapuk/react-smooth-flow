import { activeTransitions } from './store';

const cancelViewTransition = (...tags: string[]) => {
  tags.forEach((i) => {
    activeTransitions[i]?.forEach((i) => {
      i.transition.cancel();
      i.onCancel();
    });
  });
};

export default cancelViewTransition;
