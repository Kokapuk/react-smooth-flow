import { TransitionMapping, TransitionOptions } from '../types';

const filterDisabled = (transitionMapping: TransitionMapping<TransitionOptions>) => {
  const tags = Object.keys(transitionMapping);

  tags.forEach((tag) => {
    if (transitionMapping[tag].disabled) {
      delete transitionMapping[tag];
    }
  });
};

export default filterDisabled;
