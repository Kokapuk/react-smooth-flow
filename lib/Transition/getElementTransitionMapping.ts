import { DEFAULT_TRANSITION_PROPERTIES } from './config';
import getReversedKeyframes from './getReversedKeyframes';
import { ParsedTransitionProperties, TransitionMapping } from './types';

const getElementTransitionMapping = (element: HTMLElement) => {
  if (!element.dataset.transition) {
    return null;
  }

  const transitionMapping = JSON.parse(element.dataset.transition) as TransitionMapping;

  Object.keys(transitionMapping).forEach((key) => {
    const transitionProperties = transitionMapping[key];

    if (transitionProperties.exitKeyframes === 'reversedEnter') {
      if (!transitionProperties.enterKeyframes) {
        throw Error(
          `Transition target with tag "${key}" has "exitKeyframes" property set to "reversedEnter", but "enterKeyframes" was not specified. Either specify "enterKeyframes" or don't set "exitKeyframes" to "reversedEnter"`
        );
      }

      transitionProperties.exitKeyframes = getReversedKeyframes(transitionProperties.enterKeyframes);
    }

    Object.keys(DEFAULT_TRANSITION_PROPERTIES).forEach((key) => {
      const typedKey = key as keyof typeof DEFAULT_TRANSITION_PROPERTIES;

      if (transitionProperties[typedKey] === undefined) {
        (transitionProperties[typedKey] as any) = DEFAULT_TRANSITION_PROPERTIES[typedKey];
      }
    });
  });

  return transitionMapping as TransitionMapping<ParsedTransitionProperties>;
};

export default getElementTransitionMapping;
