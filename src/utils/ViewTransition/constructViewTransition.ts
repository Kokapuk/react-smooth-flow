import { ParsedViewTransitionProperties, ViewTransitionMapping } from './types';

const constructViewTransition = (mapping: ViewTransitionMapping) => {
  const fullMapping = Object.fromEntries(
    Object.entries(mapping).map(([key, record]) => [
      key,
      {
        ...record,
        mutationTransitionFadeType: record.mutationTransitionFadeType ?? 'overlap',
      } as ParsedViewTransitionProperties,
    ])
  );

  return { 'data-viewtransition': JSON.stringify(fullMapping) };
};

export default constructViewTransition;
