import defaults, { ConfigurableDefaults } from './defaults';
import getReversedKeyframes from './getReversedKeyframes';
import { ParsedTransitionProperties, TransitionMapping } from './types';

const getElementTransitionMapping = (element: HTMLElement) => {
  if (!element.dataset.transition) {
    return null;
  }

  const transitionMapping = JSON.parse(element.dataset.transition) as TransitionMapping;

  Object.keys(transitionMapping).forEach((tag) => {
    const transitionProperties = transitionMapping[tag];

    if (transitionProperties.exitKeyframes === 'reversedEnter') {
      if (!transitionProperties.enterKeyframes) {
        throw Error(
          `Transition target with tag "${tag}" has "exitKeyframes" property set to "reversedEnter", but "enterKeyframes" was not specified. Either specify "enterKeyframes" or don't set "exitKeyframes" to "reversedEnter"`
        );
      }

      transitionProperties.exitKeyframes = getReversedKeyframes(transitionProperties.enterKeyframes);
    }

    if (transitionProperties.contentExitKeyframes === 'reversedEnter') {
      if (!transitionProperties.contentEnterKeyframes) {
        throw Error(
          `Transition target with tag "${tag}" has "contentExitKeyframes" property set to "reversedEnter", but "contentEnterKeyframes" was not specified. Either specify "contentEnterKeyframes" or don't set "contentExitKeyframes" to "reversedEnter"`
        );
      }

      transitionProperties.contentExitKeyframes = getReversedKeyframes(transitionProperties.contentEnterKeyframes);
    }

    const properties = Object.keys(
      defaults.defaultTransitionProperties
    ) as (keyof ConfigurableDefaults['defaultTransitionProperties'])[];

    properties.forEach((property) => {
      if (transitionProperties[property] === undefined) {
        (transitionProperties[property] as any) = defaults.defaultTransitionProperties[property];
      }
    });
  });

  return transitionMapping as TransitionMapping<ParsedTransitionProperties>;
};

export default getElementTransitionMapping;
