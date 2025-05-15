import TransformMatrix from '@lib/transformMatrix';
import { Bounds } from '../types';

const getElementBounds = (element: HTMLElement, captureTransform?: boolean): Bounds => {
  const resetTransform = element.style.transform;
  const resetTransformPriority = element.style.getPropertyPriority('transform');
  let computedStyle: CSSStyleDeclaration | null = null;

  if (captureTransform) {
    computedStyle = window.getComputedStyle(element);

    const transform = new TransformMatrix(computedStyle.transform);
    transform.scaleX = 1;
    transform.scaleY = 1;
    transform.skewX = 0;
    transform.skewY = 0;

    element.style.setProperty('transform', transform.toString(), 'important');
  }

  const boundingRect = element.getBoundingClientRect();
  const scrollBarWidth = element.offsetWidth - element.clientWidth;
  const scrollBarHeight = element.offsetHeight - element.clientHeight;

  element.style.setProperty('transform', resetTransform, resetTransformPriority);

  let transformMatrix: TransformMatrix | null = null;

  if (captureTransform) {
    transformMatrix = computedStyle!.transform !== 'none' ? new TransformMatrix(computedStyle!.transform) : null;
  }

  return {
    top: boundingRect.top,
    right: document.documentElement.clientWidth - boundingRect.right,
    bottom: document.documentElement.clientHeight - boundingRect.bottom,
    left: boundingRect.left,
    width: boundingRect.width,
    height: boundingRect.height,
    transform: transformMatrix,
    scrollBarWidth,
    scrollBarHeight,
  };
};

export default getElementBounds;
