import defaults, { ConfigurableDefaults } from './defaults';
import getReversedKeyframes from './getReversedKeyframes';
import { ParsedTransitionOptions, TransitionMapping } from './types';

const getElementTransitionMapping = (element: HTMLElement) => {
  if (!element.dataset.transition) {
    return null;
  }

  const transitionMapping = JSON.parse(element.dataset.transition) as TransitionMapping;

  Object.keys(transitionMapping).forEach((tag) => {
    const transitionOptions = transitionMapping[tag];

    if (transitionOptions.exitKeyframes === 'reversedEnter') {
      if (!transitionOptions.enterKeyframes) {
        throw Error(
          `Transition target with tag "${tag}" has "exitKeyframes" property set to "reversedEnter", but "enterKeyframes" was not specified. Either specify "enterKeyframes" or don't set "exitKeyframes" to "reversedEnter"`
        );
      }

      transitionOptions.exitKeyframes = getReversedKeyframes(transitionOptions.enterKeyframes);
    }

    if (transitionOptions.contentExitKeyframes === 'reversedEnter') {
      if (!transitionOptions.contentEnterKeyframes) {
        throw Error(
          `Transition target with tag "${tag}" has "contentExitKeyframes" property set to "reversedEnter", but "contentEnterKeyframes" was not specified. Either specify "contentEnterKeyframes" or don't set "contentExitKeyframes" to "reversedEnter"`
        );
      }

      transitionOptions.contentExitKeyframes = getReversedKeyframes(transitionOptions.contentEnterKeyframes);
    }

    const properties = Object.keys(
      defaults.defaultTransitionOptions
    ) as (keyof ConfigurableDefaults['defaultTransitionOptions'])[];

    properties.forEach((property) => {
      if (transitionOptions[property] === undefined) {
        (transitionOptions[property] as any) = defaults.defaultTransitionOptions[property];
      }
    });
  });

  return transitionMapping as TransitionMapping<ParsedTransitionOptions>;
};

export default getElementTransitionMapping;
