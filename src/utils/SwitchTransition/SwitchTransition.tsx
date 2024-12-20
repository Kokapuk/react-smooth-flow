import cn from 'classnames';
import { cloneElement, RefObject, useEffect, useRef, useState } from 'react';
import { Element, TransitionState } from '.';
import getContainingBlock from '../getContainingBlock';
import { Rect } from '../types';

interface Props {
  children: Element;
  classes: { enter: string; exit: string };
  timeout: number | { enter: number; exit: number };
  mode?: 'out-in' | 'in-out';
  freeSpaceOnExit?: boolean;
  nodeRef?: RefObject<HTMLElement>;
}

const SwitchTransition = ({ children, classes, timeout, mode = 'out-in', freeSpaceOnExit, nodeRef }: Props) => {
  const [currentChild, setCurrentChild] = useState<Element>(children);
  const [nextChild, setNextChild] = useState<Element>(false);
  const [transitionState, setTransitionState] = useState<TransitionState>(false);
  const childKey = children ? children.key : false;
  const currentChildRef = useRef<HTMLElement>(null);
  const childRef = nodeRef ?? currentChildRef;
  const savedExitRect = useRef<Rect | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((currentChild as any)?.key === childKey) {
      setCurrentChild(children);
      return;
    }

    if (childRef.current) {
      const rect = childRef.current.getBoundingClientRect();
      savedExitRect.current = {
        left: rect.left,
        top: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      };

      const containingBlock = getContainingBlock(childRef.current);

      if (containingBlock) {
        const parentRect = containingBlock.getBoundingClientRect();
        savedExitRect.current.left -= parentRect.left;
        savedExitRect.current.top -= parentRect.top;
      }
    }

    setNextChild(children);

    const shouldPlayOut = !!currentChild;
    const shouldPlayIn = !!children;
    const enterTimeout = typeof timeout === 'number' ? timeout : timeout.exit;
    const exitTimeout = typeof timeout === 'number' ? timeout : timeout.exit;

    (async () => {
      switch (mode) {
        case 'out-in':
          if (shouldPlayOut) {
            setTransitionState('out');
            await new Promise((resolve) => setTimeout(() => resolve(undefined), exitTimeout));
            setCurrentChild(false);
          }

          if (shouldPlayIn) {
            setCurrentChild(children);
            setTransitionState('in');
            await new Promise((resolve) => setTimeout(() => resolve(undefined), enterTimeout));
          }

          setTransitionState(false);
          break;

        case 'in-out':
          setTransitionState('both');
          await new Promise((resolve) => setTimeout(() => resolve(undefined), enterTimeout));

          setCurrentChild(children);
          setTransitionState(false);
          break;
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((children as any)?.ref && !nodeRef) {
    throw Error('Wrapped element has a ref assigned. Either pass nodeRef prop or unassign ref from wrapped component.');
  }

  return (
    <>
      {!!currentChild &&
        cloneElement(currentChild, {
          ref: nodeRef ? undefined : currentChildRef,
          className: cn(
            currentChild.props.className,
            ['out', 'both'].includes(transitionState || '') && classes.exit,
            mode === 'out-in' && ['in', 'both'].includes(transitionState || '') && classes.enter
          ),
          style:
            ['out', 'both'].includes(transitionState || '') && freeSpaceOnExit && savedExitRect.current
              ? {
                  ...currentChild.props.style,
                  position: 'fixed',
                  top: savedExitRect.current.top - scrollY,
                  left: savedExitRect.current.left,
                  width: savedExitRect.current.width,
                  height: savedExitRect.current.height,
                }
              : currentChild.props.style,
        })}
      {mode === 'in-out' &&
        ['in', 'both'].includes(transitionState || '') &&
        !!nextChild &&
        cloneElement(nextChild, {
          className: cn(nextChild.props.className, classes.enter),
        })}
    </>
  );
};

export default SwitchTransition;
