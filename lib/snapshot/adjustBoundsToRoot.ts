import { Bounds } from '../types';
import getElementBounds from './getElementBounds';

export interface ComputedBorderWidth {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

const parsePixelUnit = (str: string) => parseFloat(str.replace('px', ''));

const getElementComputedBorderWidth = (element: HTMLElement) => {
  const computedStyle = window.getComputedStyle(element);

  const computedBorderWidth: ComputedBorderWidth = {
    top: parsePixelUnit(computedStyle.borderTopWidth),
    right: parsePixelUnit(computedStyle.borderRightWidth),
    bottom: parsePixelUnit(computedStyle.borderBottomWidth),
    left: parsePixelUnit(computedStyle.borderLeftWidth),
  };

  return computedBorderWidth;
};

const adjustBoundsToRoot = (bounds: Bounds, root: HTMLElement) => {
  const rootBounds = getElementBounds(root);
  const computedBorderWidth = getElementComputedBorderWidth(root);

  if (rootBounds) {
    bounds.top -= rootBounds.top - root.scrollTop + computedBorderWidth.top;
    bounds.right -= rootBounds.right + rootBounds.scrollBarWidth + root.scrollLeft - computedBorderWidth.right;
    bounds.bottom -= rootBounds.bottom + rootBounds.scrollBarHeight + root.scrollTop - computedBorderWidth.bottom;
    bounds.left -= rootBounds.left - root.scrollLeft + computedBorderWidth.left;
  }
};

export default adjustBoundsToRoot;
