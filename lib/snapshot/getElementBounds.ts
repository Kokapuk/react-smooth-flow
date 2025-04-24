import { Bounds } from '../types';

const getElementBounds = (element: Element): Bounds => {
  const boundingRect = element.getBoundingClientRect();
  const scrollBarWidth = boundingRect.width - element.clientWidth;
  const scrollBarHeight = boundingRect.height - element.clientHeight;

  return {
    top: boundingRect.top,
    right: document.documentElement.clientWidth - boundingRect.right,
    bottom: document.documentElement.clientHeight - boundingRect.bottom,
    left: boundingRect.left,
    width: boundingRect.width,
    height: boundingRect.height,
    scrollBarWidth,
    scrollBarHeight,
  };
};

export default getElementBounds;
