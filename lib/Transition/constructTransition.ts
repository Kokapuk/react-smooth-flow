import { ParsedTransitionProperties, TransitionMapping } from './types';

const constructTransition = (mapping: TransitionMapping) => {
  const fullMapping = Object.fromEntries(
    Object.entries(mapping).map(([key, record]) => [
      key,
      {
        ...record,
        contentAlign: record.contentAlign ?? 'top left',
        mutationTransitionType: record.mutationTransitionType ?? 'overlap',
      } as ParsedTransitionProperties,
    ])
  );

  return { 'data-transition': JSON.stringify(fullMapping) };
};

export default constructTransition;
