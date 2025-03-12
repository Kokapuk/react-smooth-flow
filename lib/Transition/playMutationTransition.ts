import { STYLE_PROPERTIES_TO_ANIMATE } from './defaults';
import getInitialKeyframe from './getInitialKeyframe';
import getTransitionRoot from './getTransitionRoot';
import hideElementNoTransition from './hideElementNoTransition';
import { activeTransitions } from './store';
import { Keyframes, ParsedTransitionProperties, SnapshotPair } from './types';

const getImageKeyframes = ({ prevSnapshot, nextSnapshot, shared }: SnapshotPair<'mutation'>) => {
  const generalKeyframes = [prevSnapshot, nextSnapshot].map((snapshot) => {
    const keyframe: Record<string, string> = {
      width: `${snapshot.bounds.width}px`,
      height: `${snapshot.bounds.height}px`,
    };

    STYLE_PROPERTIES_TO_ANIMATE.forEach((property) => (keyframe[property] = snapshot.computedStyle[property]));

    return keyframe;
  });

  let transform = '';
  const translateYTop = nextSnapshot.bounds.top - prevSnapshot.bounds.top;
  const translateRight = prevSnapshot.bounds.right - nextSnapshot.bounds.right;
  const translateYBottom = prevSnapshot.bounds.bottom - nextSnapshot.bounds.bottom;
  const translateXLeft = nextSnapshot.bounds.left - prevSnapshot.bounds.left;

  switch (shared.transitionProperties.positionAnchor) {
    case 'topLeft':
      transform = `translate(${translateXLeft}px, ${translateYTop}px)`;
      break;
    case 'topRight':
      transform = `translate(${translateRight}px, ${translateYTop}px)`;
      break;
    case 'bottomRight':
      transform = `translate(${translateRight}px, ${translateYBottom}px)`;
      break;
    case 'bottomLeft':
      transform = `translate(${translateXLeft}px, ${translateYBottom}px)`;
      break;
  }

  const keyframes: Keyframes = [
    { ...generalKeyframes[0], transform: 'translate(0, 0)' },
    { ...generalKeyframes[1], transform: transform },
  ];

  return keyframes;
};

const getContentKeyframes = (
  mutationTransitionType: ParsedTransitionProperties['mutationTransitionType']
): { exitContentKeyframes: Keyframes; enterContentKeyframes: Keyframes } => {
  switch (mutationTransitionType) {
    case 'overlap':
      return { exitContentKeyframes: { opacity: [1, 0] }, enterContentKeyframes: { opacity: [0, 1] } };
    case 'sequential':
      return { exitContentKeyframes: { opacity: [1, 0, 0] }, enterContentKeyframes: { opacity: [0, 0, 1] } };
    default: {
      throw Error(`"${mutationTransitionType}" is invalid mutation transition type`);
    }
  }
};

const playMutationTransition = async (pair: SnapshotPair<'mutation'>) => {
  const { shared, nextSnapshot, image } = pair;
  const transitionRoot = shared.transitionRoot ?? getTransitionRoot();
  const resetTargetStyles = hideElementNoTransition(nextSnapshot.targetElement);
  activeTransitions[shared.tag] = [];
  transitionRoot.append(image);

  const animationOptions: KeyframeAnimationOptions = {
    duration: shared.transitionProperties.duration,
    easing: shared.transitionProperties.easing,
    delay: shared.transitionProperties.delay,
    fill: 'forwards',
  };

  const imageKeyframes = getImageKeyframes(pair);

  if (shared.transitionProperties.delay) {
    image.animate(getInitialKeyframe(imageKeyframes), { fill: 'forwards' });
  }

  const removeSnapshotsAndResetTarget = () => {
    image.remove();
    resetTargetStyles();
  };

  const transition = image.animate(imageKeyframes, animationOptions);

  activeTransitions[shared.tag].push({
    animation: transition,
    snapshotPairSharedData: shared,
    cleanup: removeSnapshotsAndResetTarget,
  });

  const exitContent = image.children[0] as HTMLDivElement;
  const enterContent = image.children[1] as HTMLDivElement;
  const { exitContentKeyframes, enterContentKeyframes } = getContentKeyframes(
    shared.transitionProperties.mutationTransitionType
  );

  if (shared.transitionProperties.delay) {
    exitContent.animate(getInitialKeyframe(exitContentKeyframes), { fill: 'forwards' });
    enterContent.animate(getInitialKeyframe(enterContentKeyframes), { fill: 'forwards' });
  }

  const exitContentTransition = exitContent.animate(exitContentKeyframes, animationOptions);
  const enterContentTransition = enterContent.animate(enterContentKeyframes, animationOptions);

  activeTransitions[shared.tag].push(
    { animation: exitContentTransition, snapshotPairSharedData: shared, cleanup: removeSnapshotsAndResetTarget },
    { animation: enterContentTransition, snapshotPairSharedData: shared, cleanup: removeSnapshotsAndResetTarget }
  );

  await Promise.all(activeTransitions[shared.tag].map((transition) => transition.animation.finished));
};

export default playMutationTransition;
