import { ParsedViewTransitionProperties, ViewTransitionProperties } from './types';

const constructViewTransition = (properties: ViewTransitionProperties) => ({
  'data-viewtransition': JSON.stringify({
    ...properties,
    mutationTransitionFadeType: properties.mutationTransitionFadeType ?? 'overlap',
  } as ParsedViewTransitionProperties),
});

export default constructViewTransition;
