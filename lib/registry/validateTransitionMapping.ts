import { ResolvedTransitionOptions, TransitionMapping, TransitionOptions } from '../types';

const validateTransitionMapping = (
  transitionMapping: TransitionMapping<TransitionOptions>,
  registeredTransitionMappings: TransitionMapping<ResolvedTransitionOptions>[]
) => {
  const tags = Object.keys(transitionMapping);
  const tagFormat = '^[a-zA-Z-_0-9]+$';
  const invalidTag = tags.find((tag) => !new RegExp(tagFormat).test(tag));

  if (invalidTag) {
    throw Error(
      `Failed to register transitioned element, following tag has invalid format: "${invalidTag}".\nExpected format: "${tagFormat}"`
    );
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
