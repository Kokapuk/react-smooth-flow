import { STYLE_PROPERTIES_TO_ANIMATE } from './config';
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
    const keyframe: Record<string, string> = {
      width: `${i.boundingBox.width}px`,
      height: `${i.boundingBox.height}px`,
    };

    STYLE_PROPERTIES_TO_ANIMATE.forEach((property) => (keyframe[property] = i.computedStyle[property]));

    return keyframe;
  });

  const prevKeyframes = [
    { ...generalKeyframes[0], transform: 'translate(0, 0)' },
    {
      ...generalKeyframes[1],
      transform: `translate(${nextSnapshot.boundingBox.left - prevSnapshot.boundingBox.left}px, ${
        nextSnapshot.boundingBox.top - prevSnapshot.boundingBox.top
      }px)`,
    },
  ];
  const nextKeyframes = [
    {
      ...generalKeyframes[0],
      transform: `translate(${prevSnapshot.boundingBox.left - nextSnapshot.boundingBox.left}px, ${
        prevSnapshot.boundingBox.top - nextSnapshot.boundingBox.top
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
