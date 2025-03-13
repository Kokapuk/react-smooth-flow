import { STYLE_PROPERTIES_TO_ANIMATE } from './defaults';
import getInitialKeyframe from './getInitialKeyframe';
import getTransitionRoot from './getTransitionRoot';
import hideElementNoTransition from './hideElementNoTransition';
import { activeTransitions } from './store';
import { Keyframes, SnapshotPair } from './types';

const getImageKeyframes = ({ prevSnapshot, nextSnapshot, shared }: SnapshotPair<'mutation'>) => {
  const generalKeyframes = [prevSnapshot, nextSnapshot].map((snapshot) => {
    const keyframe: Record<string, string | number> = {
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

const playMutationTransition = async (pair: SnapshotPair<'mutation'>) => {
  const { shared, prevSnapshot, nextSnapshot, image } = pair;
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

  if (shared.transitionProperties.delay) {
    exitContent.animate(getInitialKeyframe(prevSnapshot.transitionProperties.contentExitKeyframes), {
      fill: 'forwards',
    });
    enterContent.animate(getInitialKeyframe(nextSnapshot.transitionProperties.contentEnterKeyframes), {
      fill: 'forwards',
    });
  }

  const exitContentTransition = exitContent.animate(
    prevSnapshot.transitionProperties.contentExitKeyframes,
    animationOptions
  );
  const enterContentTransition = enterContent.animate(
    nextSnapshot.transitionProperties.contentEnterKeyframes,
    animationOptions
  );

  activeTransitions[shared.tag].push(
    { animation: exitContentTransition, snapshotPairSharedData: shared, cleanup: removeSnapshotsAndResetTarget },
    { animation: enterContentTransition, snapshotPairSharedData: shared, cleanup: removeSnapshotsAndResetTarget }
  );

  await Promise.all(activeTransitions[shared.tag].map((transition) => transition.animation.finished));
};

export default playMutationTransition;
