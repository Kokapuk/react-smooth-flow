import { STYLE_PROPERTIES_TO_ANIMATE } from './config';
import getInitialKeyframe from './getInitialKeyframe';
import getTransitionRoot from './getTransitionRoot';
import hideElementNoTransition from './hideElementNoTransition';
import { activeTransitions } from './store';
import { Keyframes, Snapshot } from './types';

const playMutationTransition = async (targetElement: HTMLElement, prevSnapshot: Snapshot, nextSnapshot: Snapshot) => {
  const transitionRoot = prevSnapshot.transitionRoot ?? getTransitionRoot();

  const resetTargetStyles = hideElementNoTransition(targetElement);

  activeTransitions[prevSnapshot.tag] = [];

  transitionRoot.append(prevSnapshot.image);
  transitionRoot.append(nextSnapshot.image);

  const generalKeyframes = [prevSnapshot, nextSnapshot].map((i) => {
    const keyframe: Record<string, string> = {
      width: `${i.bounds.width}px`,
      height: `${i.bounds.height}px`,
    };

    STYLE_PROPERTIES_TO_ANIMATE.forEach((property) => (keyframe[property] = i.computedStyle[property]));

    return keyframe;
  });

  let prevTransform = '';
  let nextTransform = '';
  const translateYPrevTop = nextSnapshot.bounds.top - prevSnapshot.bounds.top;
  const translateYNextTop = prevSnapshot.bounds.top - nextSnapshot.bounds.top;
  const translateXPrevRight = prevSnapshot.bounds.right - nextSnapshot.bounds.right;
  const translateXNextRight = nextSnapshot.bounds.right - prevSnapshot.bounds.right;
  const translateYPrevBottom = prevSnapshot.bounds.bottom - nextSnapshot.bounds.bottom;
  const translateYNextBottom = nextSnapshot.bounds.bottom - prevSnapshot.bounds.bottom;
  const translateXPrevLeft = nextSnapshot.bounds.left - prevSnapshot.bounds.left;
  const translateXNextLeft = prevSnapshot.bounds.left - nextSnapshot.bounds.left;

  switch (prevSnapshot.transitionProperties.origin) {
    case 'topLeft':
      prevTransform = `translate(${translateXPrevLeft}px, ${translateYPrevTop}px)`;
      nextTransform = `translate(${translateXNextLeft}px, ${translateYNextTop}px)`;
      break;
    case 'topRight':
      prevTransform = `translate(${translateXPrevRight}px, ${translateYPrevTop}px)`;
      nextTransform = `translate(${translateXNextRight}px, ${translateYNextTop}px)`;
      break;
    case 'bottomRight':
      prevTransform = `translate(${translateXPrevRight}px, ${translateYPrevBottom}px)`;
      nextTransform = `translate(${translateXNextRight}px, ${translateYNextBottom}px)`;
      break;
    case 'bottomLeft':
      prevTransform = `translate(${translateXPrevLeft}px, ${translateYPrevBottom}px)`;
      nextTransform = `translate(${translateXNextLeft}px, ${translateYNextBottom}px)`;
      break;
  }

  const prevKeyframes: Keyframes = [
    { opacity: prevSnapshot.computedStyle.opacity, ...generalKeyframes[0], transform: 'translate(0, 0)' },
    { opacity: prevSnapshot.computedStyle.opacity },
    { opacity: 0, ...generalKeyframes[1], transform: prevTransform },
  ];
  const nextKeyframes: Keyframes = [
    { opacity: 0, ...generalKeyframes[0], transform: nextTransform },
    { opacity: nextSnapshot.computedStyle.opacity },
    { opacity: nextSnapshot.computedStyle.opacity, ...generalKeyframes[1], transform: 'translate(0, 0)' },
  ];

  const animationOptions: KeyframeAnimationOptions = {
    duration: prevSnapshot.transitionProperties.duration,
    easing: prevSnapshot.transitionProperties.easing,
    delay: prevSnapshot.transitionProperties.delay,
    fill: 'forwards',
  };

  if (prevSnapshot.transitionProperties.delay) {
    prevSnapshot.image.animate(getInitialKeyframe(prevKeyframes), { fill: 'forwards' });
    nextSnapshot.image.animate(getInitialKeyframe(nextKeyframes), { fill: 'forwards' });
  }

  const removeSnapshotsAndResetTarget = () => {
    prevSnapshot.image.remove();
    nextSnapshot.image.remove();

    resetTargetStyles();
  };

  const prevTransition = prevSnapshot.image.animate(prevKeyframes, animationOptions);
  const nextTransition = nextSnapshot.image.animate(nextKeyframes, animationOptions);

  activeTransitions[prevSnapshot.tag].push(
    { transition: prevTransition, snapshot: prevSnapshot, onCancel: removeSnapshotsAndResetTarget },
    { transition: nextTransition, snapshot: nextSnapshot, onCancel: removeSnapshotsAndResetTarget }
  );

  if (prevSnapshot.transitionProperties.mutationTransitionType === 'sequential') {
    const prevContentKeyframes: Keyframes = { opacity: [1, 0, 0] };
    const nextContentKeyframes: Keyframes = { opacity: [0, 0, 1] };

    if (prevSnapshot.transitionProperties.delay) {
      prevSnapshot.image.children[0].animate(getInitialKeyframe(prevContentKeyframes), { fill: 'forwards' });
      nextSnapshot.image.children[0].animate(getInitialKeyframe(nextContentKeyframes), { fill: 'forwards' });
    }

    const prevContentTransition = prevSnapshot.image.children[0].animate(prevContentKeyframes, animationOptions);
    const nextContentTransition = nextSnapshot.image.children[0].animate(nextContentKeyframes, animationOptions);

    activeTransitions[prevSnapshot.tag].push(
      { transition: prevContentTransition, snapshot: prevSnapshot, onCancel: removeSnapshotsAndResetTarget },
      { transition: nextContentTransition, snapshot: nextSnapshot, onCancel: removeSnapshotsAndResetTarget }
    );
  } else if (prevSnapshot.transitionProperties.mutationTransitionType !== 'overlap') {
    throw Error(`"${prevSnapshot.transitionProperties.mutationTransitionType}" is invalid mutation transition type`);
  }

  await Promise.all(activeTransitions[prevSnapshot.tag].map((i) => i.transition.finished));
};

export default playMutationTransition;
