import defaults, { ConfigurableDefaults } from './defaults';
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

    Object.keys(defaults.defaultTransitionProperties).forEach((key) => {
      const typedKey = key as keyof ConfigurableDefaults['defaultTransitionProperties'];

      if (transitionProperties[typedKey] === undefined) {
        (transitionProperties[typedKey] as any) = defaults.defaultTransitionProperties[typedKey];
      }
    });
  });

  return transitionMapping as TransitionMapping<ParsedTransitionProperties>;
};

export default getElementTransitionMapping;
