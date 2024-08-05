import cn from 'classnames';
import { cloneElement, RefObject, useEffect, useRef, useState } from 'react';
import { Element } from '.';
import { Rect } from '../LayoutTransition';

interface Props {
  children: Element;
  classes: { enter: string; exit: string };
  timeout: number | { enter: number; exit: number };
  mode?: 'out-in' | 'in-out';
  freeSpaceOnExit?: boolean;
  nodeRef?: RefObject<HTMLElement>;
}

const SwitchTransition = ({ children, classes, timeout, mode = 'out-in', freeSpaceOnExit, nodeRef }: Props) => {
  const [inChild, setInChild] = useState<Element>(children);
  const [outChild, setOutChild] = useState<Element>(false);
  const [transitionState, setTransitionState] = useState<'out' | 'in' | 'both' | false>(false);
  const childKey = children ? children.key : false;
  const innerChildRef = useRef<HTMLElement>(null);
  const childRef = nodeRef ?? innerChildRef;
  const savedExitPos = useRef<Pick<Rect, 'top' | 'left'> | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [lastProps, setLastProps] = useState(children ? children.props : null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((inChild as any).key === childKey) {
      return;
    }

    if (childRef.current) {
      const rect = childRef.current.getBoundingClientRect();
      savedExitPos.current = { left: rect.left, top: rect.top + window.scrollY };
    }

    setOutChild(inChild);
    setInChild(children);

    const shouldPlayOut = !!inChild;
    const shouldPlayIn = !!children;
    const enterTimeout = typeof timeout === 'number' ? timeout : timeout.exit;
    const exitTimeout = typeof timeout === 'number' ? timeout : timeout.exit;

    (async () => {
      switch (mode) {
        case 'out-in':
          if (shouldPlayOut) {
            setTransitionState('out');

            await new Promise((resolve) => {
              setTimeout(() => {
                resolve(undefined);
              }, exitTimeout);
            });
          }

          if (shouldPlayIn) {
            setTransitionState('in');

            await new Promise((resolve) => {
              setTimeout(() => {
                resolve(undefined);
              }, enterTimeout);
            });
          }

          setTransitionState(false);
          break;

        case 'in-out':
          setTransitionState('both');

          setTimeout(() => {
            setTransitionState(false);
          }, enterTimeout);
          break;
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childKey]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!children) {
      return;
    }

    setLastProps(children.props);
  }, [children]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((children as any).ref && !nodeRef) {
    throw new Error(
      'Wrapped element has a ref assigned. Either pass nodeRef prop or unassign ref from wrapped component.'
    );
  }

  return (
    <>
      {(!transitionState || transitionState === 'in' || transitionState === 'both') &&
        !!inChild &&
        cloneElement(inChild, {
          ...(lastProps ?? {}),
          ref: nodeRef ? undefined : innerChildRef,
          className: cn(
            (lastProps ?? inChild.props).className,
            (transitionState === 'in' || transitionState === 'both') && classes.enter
          ),
        })}
      {(transitionState === 'out' || transitionState === 'both') &&
        !!outChild &&
        cloneElement(outChild, {
          ...(lastProps ?? {}),
          className: cn((lastProps ?? outChild.props).className, classes.exit),
          style:
            freeSpaceOnExit && savedExitPos.current
              ? {
                  ...(lastProps ?? outChild.props).style,
                  position: 'fixed',
                  top: savedExitPos.current.top - scrollY,
                  left: savedExitPos.current.left,
                }
              : (lastProps ?? outChild.props).style,
        })}
    </>
  );
};

export default SwitchTransition;
