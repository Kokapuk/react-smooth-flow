import { ParsedTransitionProperties, TransitionMapping } from './types';

const getElementTransitionMapping = (element: HTMLElement) => {
  if (!element.dataset.transition) {
    return null;
  }

  return JSON.parse(element.dataset.transition) as TransitionMapping<ParsedTransitionProperties>;
};

export default getElementTransitionMapping;
