import getTruthyArray from './getTruthyArray';
import { activeTransitions } from './store';
import { FalsyArray, Tag } from './types';

const cancelTransition = (...tags: FalsyArray<Tag>) => {
  const validTags = getTruthyArray(tags);

  validTags.forEach((tag) => {
    activeTransitions[tag]?.forEach((transition) => {
      transition.animation.cancel();
      transition.onCancel();
    });

    delete activeTransitions[tag];
  });
};

export default cancelTransition;
