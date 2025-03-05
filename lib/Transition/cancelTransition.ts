import getTruthyArray from './getTruthyArray';
import { activeTransitions } from './store';
import { FalsyArray, Tag } from './types';

const cancelTransition = (...tags: FalsyArray<Tag>) => {
  const validTags = getTruthyArray(tags);

  validTags.forEach((i) => {
    activeTransitions[i]?.forEach((i) => {
      i.transition.cancel();
      i.onCancel();
    });

    delete activeTransitions[i];
  });
};

export default cancelTransition;
