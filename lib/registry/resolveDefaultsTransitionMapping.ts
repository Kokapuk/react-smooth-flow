import { ResolvedTransitionOptions, TransitionMapping, TransitionOptions } from '../types';
import resolveTransitionOptions from './resolveTransitionOptions';

function resolveDefaultsTransitionMapping(
  transitionMapping: TransitionMapping<TransitionOptions>
): asserts transitionMapping is TransitionMapping<ResolvedTransitionOptions> {
  const tags = Object.keys(transitionMapping);

  tags.forEach((tag) => {
    const transitionOptions = transitionMapping[tag];

    try {
      resolveTransitionOptions(transitionOptions);
    } catch (err: unknown) {
      if (err instanceof Error) {
        switch (err.name) {
          case 'ExitKeyframes':
          case 'ContentExitKeyframes':
            throw Error(`Element with tag "${tag}" has ${err.message}`);
          default:
            throw err;
        }
      }
    }
  });
}

export default resolveDefaultsTransitionMapping;
