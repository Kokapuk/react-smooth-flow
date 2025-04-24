import { STYLE_PROPERTIES_TO_CAPTURE } from '../defaults';
import { ComputedStyle } from '../types';

const getComputedStyleNoRef = (element: HTMLElement): ComputedStyle => {
  const computedStyleWithRef = window.getComputedStyle(element);

  const computedStyle = Object.fromEntries(
    STYLE_PROPERTIES_TO_CAPTURE.map((property) => [property, computedStyleWithRef[property]])
  ) as ComputedStyle;

  return computedStyle;
};

export default getComputedStyleNoRef;
