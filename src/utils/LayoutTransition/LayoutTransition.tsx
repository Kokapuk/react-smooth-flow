import { cloneElement, DependencyList, HTMLProps, ReactElement, RefObject, useLayoutEffect, useRef } from 'react';
import { Position, Rect } from '.';

interface Props {
  children: ReactElement<HTMLProps<HTMLElement>>;
  deps: DependencyList;
  delayedDeps: DependencyList;
  duration: number;
  nodeRef?: RefObject<HTMLElement>;
  easing?: string;
  constraints?: ('size' | 'position')[];
  positionParent?: RefObject<HTMLElement>;
}

const LayoutTransition = ({
  children,
  deps,
  delayedDeps,
  duration,
  nodeRef,
  easing,
  constraints = ['size', 'position'],
  positionParent,
}: Props) => {
  const elementRef = useRef<HTMLElement | null>(null);
  const element = nodeRef ?? elementRef;
  const currentRect = useRef<Rect>({
    left: 0,
    top: 0,
    height: 0,
    width: 0,
  });
  const currentParentRect = useRef<Rect | null>(null);
  const transition = useRef<Animation | null>(null);
  const initialRender = useRef(true);

  const parseTransform = (matrix: string) => {
    const splitted = matrix.replace('matrix(', '').replace(')', '').split(',');

    return { translateX: +splitted[4], translateY: +splitted[5], scaleX: +splitted[0], scaleY: +splitted[3] };
  };

  useLayoutEffect(() => {
    if (!element.current) {
      return;
    }

    const elementRect = element.current.getBoundingClientRect();

    currentRect.current = {
      left: elementRect.left,
      top: elementRect.top,
      width: elementRect.width,
      height: elementRect.height,
    };

    if (!positionParent?.current) {
      currentParentRect.current = null;
      return;
    }

    const parentRect = positionParent.current.getBoundingClientRect();

    currentParentRect.current = {
      left: parentRect.left,
      top: parentRect.top,
      width: parentRect.width,
      height: parentRect.height,
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useLayoutEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    if (!element.current) {
      return;
    }

    const elementRect = element.current.getBoundingClientRect();

    const nextRect: Rect = {
      left: elementRect.left,
      top: elementRect.top,
      width: elementRect.width,
      height: elementRect.height,
    };

    const deltaPos: Position = {
      left: currentRect.current.left - nextRect.left,
      top: currentRect.current.top - nextRect.top,
    };

    const parentRect = positionParent?.current?.getBoundingClientRect();

    const nextParentRect: Rect | null = parentRect
      ? {
          left: parentRect.left,
          top: parentRect.top,
          width: parentRect.width,
          height: parentRect.height,
        }
      : null;

    if (nextParentRect && currentParentRect.current) {
      deltaPos.left -= currentParentRect.current.left - nextParentRect.left;
      deltaPos.top -= currentParentRect.current.top - nextParentRect.top;
    }

    if (transition.current) {
      const transform = parseTransform(window.getComputedStyle(element.current).transform);
      deltaPos.left += transform.translateX;
      deltaPos.top += transform.translateY;

      transition.current.cancel();

      nextRect.width = element.current.getBoundingClientRect().width;
      nextRect.height = element.current.getBoundingClientRect().height;
    }

    transition.current = element.current.animate(
      [
        {
          transformOrigin: constraints.includes('position') ? 'top left' : undefined,
          transform: constraints.includes('position') ? `translate(${deltaPos.left}px, ${deltaPos.top}px)` : undefined,
          width: constraints.includes('size') ? `${currentRect.current.width}px` : undefined,
          height: constraints.includes('size') ? `${currentRect.current.height}px` : undefined,
        },
        {
          transformOrigin: constraints.includes('position') ? 'top left' : undefined,
          transform: constraints.includes('position') ? 'none' : undefined,
          width: constraints.includes('size') ? `${nextRect.width}px` : undefined,
          height: constraints.includes('size') ? `${nextRect.height}px` : undefined,
        },
      ],
      {
        duration,
        easing: easing ?? 'ease',
        fill: 'none',
      }
    );

    transition.current.onfinish = () => (transition.current = null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, delayedDeps);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((children as any).ref && !nodeRef) {
    throw new Error(
      'Wrapped element has a ref assigned. Either pass nodeRef prop or unassign ref from wrapped component.'
    );
  }

  return cloneElement(children, {
    ref: nodeRef ? undefined : elementRef,
  });
};

export default LayoutTransition;
