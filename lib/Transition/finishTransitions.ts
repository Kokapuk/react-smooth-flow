import { activeTransitions } from './store';

const finishTransitions = (...tags: string[]) => {
  tags.forEach((i) => {
    activeTransitions[i]?.forEach((i) => {
      i.onCancel();
    });

    delete activeTransitions[i];
  });
};

export default finishTransitions;
