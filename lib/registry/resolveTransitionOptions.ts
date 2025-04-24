import defaults, { ConfigurableDefaults } from '../defaults';
import getReversedKeyframes from '../getReversedKeyframes';
import { ResolvedTransitionOptions, TransitionOptions } from '../types';

function resolveTransitionOptions(
  transitionOptions: TransitionOptions
): asserts transitionOptions is ResolvedTransitionOptions {
  if (transitionOptions.exitKeyframes === 'reversedEnter') {
    if (!transitionOptions.enterKeyframes) {
      const error = new Error(
        `"exitKeyframes" property set to "reversedEnter", but "enterKeyframes" was not specified. Either specify "enterKeyframes" or don't set "exitKeyframes" to "reversedEnter"`
      );
      error.name = 'ExitKeyframesError';
      throw error;
    }

    transitionOptions.exitKeyframes = getReversedKeyframes(transitionOptions.enterKeyframes);
  }

  if (transitionOptions.contentExitKeyframes === 'reversedEnter') {
    if (!transitionOptions.contentEnterKeyframes) {
      const error = new Error(
        `"contentExitKeyframes" property set to "reversedEnter", but "contentEnterKeyframes" was not specified. Either specify "contentEnterKeyframes" or don't set "contentExitKeyframes" to "reversedEnter"`
      );
      error.name = 'ContentExitKeyframesError';
      throw error;
    }

    transitionOptions.contentExitKeyframes = getReversedKeyframes(transitionOptions.contentEnterKeyframes);
  }

  const properties = Object.keys(defaults.transitionOptions) as (keyof ConfigurableDefaults['transitionOptions'])[];

  properties.forEach((property) => {
    if (transitionOptions[property] === undefined) {
      const defaultPropertyValue = defaults.transitionOptions[property];
      (transitionOptions[property] as unknown as typeof defaultPropertyValue) = defaultPropertyValue;
    }
  });
}

export default resolveTransitionOptions;
