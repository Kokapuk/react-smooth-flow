import getElementBounds from './getElementBounds';
import { Bounds } from '../types';

const adjustBoundsToRoot = (bounds: Bounds, root: HTMLElement) => {
  const rootBounds = getElementBounds(root);

  if (rootBounds) {
    bounds.top -= rootBounds.top - root.scrollTop;
    bounds.right -= rootBounds.right + rootBounds.scrollBarWidth + root.scrollLeft;
    bounds.left -= rootBounds.left - root.scrollLeft;
    bounds.bottom -= rootBounds.bottom + rootBounds.scrollBarHeight + root.scrollTop;
  }
};

export default adjustBoundsToRoot;
