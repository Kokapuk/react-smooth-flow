import cn from 'classnames';
import { cloneElement, useEffect, useRef, useState } from 'react';
import { Element, TransitionState } from '.';
import { Rect } from '../LayoutTransition';

interface Props {
  children: Element;
  classes: { enter: string; exit: string };
  freeSpaceOnExit?: boolean;
  trigger: 'transition' | 'animation';
}

const SwitchTransition = ({ children, classes, freeSpaceOnExit, trigger }: Props) => {
  const [currentChild, setCurrentChild] = useState(children);
  const nextChild = useRef<Element>(false);
  const [transitionState, setTransitionState] = useState<TransitionState>('none');
  const savedPos = useRef<Pick<Rect, 'top' | 'left'> | null>(null);
  const currentChildRef = useRef<HTMLElement | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const childKey = children ? children.key : false;

  useEffect(() => {
    if (children === currentChild) {
      return;
    }

    setTransitionState('exit');
    savedPos.current = null;

    if (!currentChild) {
      setCurrentChild(children);

      if (trigger === 'animation') {
        setTransitionState('enter');
      } else if (trigger === 'transition') {
        setTimeout(() => {
          setTransitionState('enter');
        }, 10);
      }

      return;
    }

    nextChild.current = children;

    if (!currentChildRef.current) {
      return;
    }

    const currentChildRect = currentChildRef.current.getBoundingClientRect();
    savedPos.current = { left: currentChildRect.left, top: currentChildRect.top + window.scrollY };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childKey]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const updateTransitionState = () => {
    switch (transitionState) {
      case 'enter':
        setTransitionState('none');
        break;
      case 'exit':
        setCurrentChild(nextChild.current);

        if (trigger === 'animation') {
          setTransitionState('enter');
        } else if (trigger === 'transition') {
          setTimeout(() => {
            setTransitionState('enter');
          }, 10);
        }

        break;
    }
  };

  const handleTransitionEnd = (event: React.TransitionEvent<HTMLElement>) => {
    if (!currentChild) {
      return;
    }

    currentChild.props.onTransitionEnd?.(event);

    if (trigger !== 'transition') {
      return;
    }

    updateTransitionState();
  };

  const handleAnimationEnd = (event: React.AnimationEvent<HTMLElement>) => {
    if (!currentChild) {
      return;
    }

    currentChild.props.onAnimationEnd?.(event);

    if (trigger !== 'animation') {
      return;
    }

    updateTransitionState();
  };

  if (!currentChild) {
    return null;
  }

  return cloneElement(currentChild, {
    ref: currentChildRef,
    className: cn(currentChild.props.className, transitionState !== 'none' && classes[transitionState]),
    onTransitionEnd: handleTransitionEnd,
    onAnimationEnd: handleAnimationEnd,
    style:
      freeSpaceOnExit && transitionState === 'exit' && savedPos.current
        ? {
            ...currentChild.props.style,
            position: 'fixed',
            top: savedPos.current.top - scrollY,
            left: savedPos.current.left,
          }
        : currentChild.props.style,
  });
};

export default SwitchTransition;
