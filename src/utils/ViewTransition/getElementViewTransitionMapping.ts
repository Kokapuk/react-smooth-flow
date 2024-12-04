import { ParsedViewTransitionProperties, ViewTransitionMapping } from './types';

const getElementViewTransitionMapping = (element: HTMLElement) => {
  if (!element.dataset.viewtransition) {
    return null;
  }

  return JSON.parse(element.dataset.viewtransition) as ViewTransitionMapping<ParsedViewTransitionProperties>;
};

export default getElementViewTransitionMapping;
