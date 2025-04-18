import { TransitionMapping } from '../types';

const filterDisabled = (transitionMapping: TransitionMapping) => {
  const tags = Object.keys(transitionMapping);

  tags.forEach((tag) => {
    if (transitionMapping[tag].disabled) {
      delete transitionMapping[tag];
    }
  });
};

export default filterDisabled;
