import { STYLE_PROPERTIES_TO_CAPTURE } from './config';
import { ComputedStyle } from './types';

const getComputedStyleNoRef = (element: HTMLElement): ComputedStyle => {
  const computedStyleWithRef = window.getComputedStyle(element);
  const computedStyle: Partial<ComputedStyle> = {};

  STYLE_PROPERTIES_TO_CAPTURE.forEach(
    (i) => (computedStyle[i] = computedStyleWithRef[i as keyof typeof computedStyleWithRef] as string)
  );

  return computedStyle as ComputedStyle;
};

export default getComputedStyleNoRef;
