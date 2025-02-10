/* eslint-disable @typescript-eslint/no-explicit-any */
import { computedStylePropertiesToAnimate } from './config';
import getViewTransitionRoot from './getViewTransitionRoot';
import hideElementNoTransition from './hideElementNoTransition';
import { activeTransitions } from './store';
import { Snapshot, ViewTransitionConfig } from './types';

const playMutationTransition = async (
  targetElement: HTMLElement,
  prevSnapshot: Snapshot,
  nextSnapshot: Snapshot,
  config: ViewTransitionConfig
) => {
  const viewTransitionRoot = prevSnapshot.viewTransitionRoot ?? getViewTransitionRoot();

  const resetTargetStyles = hideElementNoTransition(targetElement);

  viewTransitionRoot.append(prevSnapshot.image);
  viewTransitionRoot.append(nextSnapshot.image);

  const generalKeyframes = [prevSnapshot, nextSnapshot].map((i) => {
    const keyframes: Record<string, string> = {
      width: `${i.rect.width}px`,
      height: `${i.rect.height}px`,
    };

    computedStylePropertiesToAnimate.forEach(
      (property) => (keyframes[property] = i.computedStyle[property])
    );

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

  if (prevSnapshot.viewTransitionProperties.mutationTransitionFadeType === 'overlap') {
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
  } else if (prevSnapshot.viewTransitionProperties.mutationTransitionFadeType === 'sequential') {
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
    throw Error(
      `"${prevSnapshot.viewTransitionProperties.mutationTransitionFadeType}" is invalid mutation transition fade type`
    );
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
