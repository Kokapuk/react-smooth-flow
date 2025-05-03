import { ResolvedTransitionOptions, TransitionMapping, TransitionOptions } from '../types';

const validateTransitionMapping = (
  transitionMapping: TransitionMapping<TransitionOptions>,
  registeredTransitionMappings: TransitionMapping<ResolvedTransitionOptions>[]
) => {
  const tags = Object.keys(transitionMapping);
  const invalidTag = tags.find((tag) => tag.includes(' '));

  if (invalidTag) {
    throw Error(`Failed to register transitioned element.\nTag must not contain spaces: "${invalidTag}"`);
  }

  registeredTransitionMappings.forEach((mapping) => {
    const tags = Object.keys(mapping);

    tags.forEach((tag) => {
      if (mapping[tag].disabled) {
        delete mapping[tag];
      }
    });
  });

  const registeredTags = registeredTransitionMappings.flatMap((mapping) => Object.keys(mapping));
  const repetitiveTag = tags.find((tag) => registeredTags.includes(tag));

  if (repetitiveTag) {
    throw Error(
      `Failed to register transitioned element, element with a following tag is already registered: "${repetitiveTag}".\nTags should be unique`
    );
  }
};

export default validateTransitionMapping;
