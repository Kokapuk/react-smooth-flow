import { ViewTransitionProperties } from './types';

const constructViewTransition = (properties: ViewTransitionProperties) => ({
  'data-viewtransition': JSON.stringify(properties),
});

export default constructViewTransition;
