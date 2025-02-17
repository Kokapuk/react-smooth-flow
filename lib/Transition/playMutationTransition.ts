import { computedStylePropertiesToAnimate } from './config';
import getTransitionRoot from './getTransitionRoot';
import hideElementNoTransition from './hideElementNoTransition';
import { activeTransitions } from './store';
import { Snapshot, TransitionConfig } from './types';

const playMutationTransition = async (
  targetElement: HTMLElement,
  prevSnapshot: Snapshot,
  nextSnapshot: Snapshot,
  config: TransitionConfig
) => {
  const transitionRoot = prevSnapshot.transitionRoot ?? getTransitionRoot();

  const resetTargetStyles = hideElementNoTransition(targetElement);

  transitionRoot.append(prevSnapshot.image);
  transitionRoot.append(nextSnapshot.image);

  const generalKeyframes = [prevSnapshot, nextSnapshot].map((i) => {
    const keyframes: Record<string, string> = {
      width: `${i.rect.width}px`,
      height: `${i.rect.height}px`,
    };

    computedStylePropertiesToAnimate.forEach((property) => (keyframes[property] = i.computedStyle[property]));

    return keyframes;
  });

  const prevKeyframes = [
    { ...generalKeyframes[0], transform: 'translate(0, 0)' },
    {
      ...generalKeyframes[1],
      transform: `translate(${nextSnapshot.rect.left - prevSnapshot.rect.left}px, ${
        nextSnapshot.rect.top - prevSnapshot.rect.top
      }px)`,
    },
  ];
  const nextKeyframes = [
    {
      ...generalKeyframes[0],
      transform: `translate(${prevSnapshot.rect.left - nextSnapshot.rect.left}px, ${
        prevSnapshot.rect.top - nextSnapshot.rect.top
      }px)`,
    },
    { ...generalKeyframes[1], transform: 'translate(0, 0)' },
  ];

  const animationOptions: KeyframeAnimationOptions = {
    duration: config.duration,
    easing: config.easing ?? 'ease',
  };
  const transitions: Animation[] = [];

  if (prevSnapshot.transitionProperties.mutationTransitionType === 'overlap') {
    const prevTransition = prevSnapshot.image.animate(
      [
        { opacity: prevSnapshot.computedStyle.opacity, ...prevKeyframes[0] },
        { opacity: prevSnapshot.computedStyle.opacity },
        { opacity: 0, ...prevKeyframes[1] },
      ],
      animationOptions
    );

    const nextTransition = nextSnapshot.image.animate(
      [
        { opacity: 0, ...nextKeyframes[0] },
        { opacity: nextSnapshot.computedStyle.opacity },
        { opacity: nextSnapshot.computedStyle.opacity, ...nextKeyframes[1] },
      ],
      animationOptions
    );

    transitions.push(prevTransition, nextTransition);
  } else if (prevSnapshot.transitionProperties.mutationTransitionType === 'sequential') {
    const prevTransition = prevSnapshot.image.animate(
      [
        { opacity: prevSnapshot.computedStyle.opacity, ...prevKeyframes[0] },
        { opacity: prevSnapshot.computedStyle.opacity },
        { opacity: 0, ...prevKeyframes[1] },
      ],
      animationOptions
    );

    const nextTransition = nextSnapshot.image.animate(
      [
        { opacity: 0, ...nextKeyframes[0] },
        { opacity: nextSnapshot.computedStyle.opacity },
        { opacity: nextSnapshot.computedStyle.opacity, ...nextKeyframes[1] },
      ],
      animationOptions
    );

    const prevContentTransition = prevSnapshot.image.children[0].animate(
      [{ opacity: 1 }, { opacity: 0 }, { opacity: 0 }],
      animationOptions
    );

    const nextContentTransition = nextSnapshot.image.children[0].animate(
      [{ opacity: 0 }, { opacity: 0 }, { opacity: 1 }],
      animationOptions
    );

    transitions.push(prevTransition, nextTransition, prevContentTransition, nextContentTransition);
  } else {
    throw Error(`"${prevSnapshot.transitionProperties.mutationTransitionType}" is invalid mutation transition type`);
  }

  const removeSnapshotsAndResetTarget = () => {
    prevSnapshot.image.remove();
    nextSnapshot.image.remove();

    resetTargetStyles();
  };

  activeTransitions[prevSnapshot.tag] = transitions.map((i) => ({
    transition: i,
    onCancel: removeSnapshotsAndResetTarget,
  }));

  await Promise.all(transitions.map((i) => i.finished));
  delete activeTransitions[prevSnapshot.tag];

  removeSnapshotsAndResetTarget();
};

export default playMutationTransition;
