import { TransitionMapping } from './types';

const constructTransition = (mapping: TransitionMapping) => ({
  'data-transition': JSON.stringify(mapping),
});

export default constructTransition;
