import { ParsedTransitionProperties, TransitionMapping } from './types';

const constructTransition = (mapping: TransitionMapping) => {
  const fullMapping = Object.fromEntries(
    Object.entries(mapping).map(([key, record]) => {
      const preserializedTransitionProperties: ParsedTransitionProperties = {
        ...record,
        contentAlign: record.contentAlign ?? 'topLeft',
        mutationTransitionType: record.mutationTransitionType ?? 'overlap',
        overflow: record.overflow ?? 'hidden',
      };

      return [key, preserializedTransitionProperties];
    })
  );

  return { 'data-transition': JSON.stringify(fullMapping) };
};

export default constructTransition;
