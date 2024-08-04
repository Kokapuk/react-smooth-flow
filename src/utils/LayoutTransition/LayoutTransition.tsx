import { cloneElement, DependencyList, HTMLProps, ReactElement, useLayoutEffect, useRef } from 'react';
import { Rect } from '.';

interface Props {
  children: ReactElement<HTMLProps<HTMLElement>>;
  deps: DependencyList;
  delayedDeps: DependencyList;
  duration: number;
}

const LayoutTransition = ({ children, deps, delayedDeps, duration }: Props) => {
  const element = useRef<HTMLElement | null>(null);
  const currentRect = useRef<Rect>({
    left: 0,
    top: 0,
    height: 0,
    width: 0,
  });
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

    const deltaRect: Rect = {
      left: currentRect.current.left - nextRect.left,
      top: currentRect.current.top - nextRect.top,
      width: currentRect.current.width / nextRect.width,
      height: currentRect.current.height / nextRect.height,
    };

    if (transition.current) {
      const transform = parseTransform(window.getComputedStyle(element.current).transform);
      deltaRect.left += transform.translateX;
      deltaRect.top += transform.translateY;
      deltaRect.width *= transform.scaleX;
      deltaRect.height *= transform.scaleY;

      transition.current.cancel();
    }

    transition.current = element.current.animate(
      [
        {
          transformOrigin: 'top left',
          transform: `
            translate(${deltaRect.left}px, ${deltaRect.top}px)
            scale(${deltaRect.width}, ${deltaRect.height})
          `,
        },
        {
          transformOrigin: 'top left',
          transform: 'none',
        },
      ],
      {
        duration,
        easing: 'ease',
        fill: 'none',
      }
    );

    transition.current.onfinish = () => (transition.current = null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, delayedDeps);

  return cloneElement(children, {
    ref: element,
  });
};

export default LayoutTransition;
