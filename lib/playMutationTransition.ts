import { STYLE_PROPERTIES_TO_ANIMATE } from './defaults';
import getInitialKeyframe from './getInitialKeyframe';
import getTransitionRoot from './getTransitionRoot';
import hideElementNoTransition from './hideElementNoTransition';
import { Keyframes, MutationSnapshotPair, Tag, Transition } from './types';

const getImageKeyframes = ({ prevSnapshot, nextSnapshot, shared }: MutationSnapshotPair) => {
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

  switch (shared.transitionOptions.positionAnchor) {
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

const playMutationTransition = (pair: MutationSnapshotPair, transitions: Record<Tag, Transition[]>) => {
  const { shared, prevSnapshot, nextSnapshot, image } = pair;
  const transitionRoot = shared.transitionRoot ?? getTransitionRoot();
  const resetTargetStyles = hideElementNoTransition(nextSnapshot.targetElement);
  transitions[shared.tag] = [];
  transitionRoot.append(image);

  const animationOptions: KeyframeAnimationOptions = {
    duration: shared.transitionOptions.duration,
    easing: shared.transitionOptions.easing,
    delay: shared.transitionOptions.delay,
    fill: 'forwards',
  };

  const imageKeyframes = getImageKeyframes(pair);

  if (shared.transitionOptions.delay) {
    image.animate(getInitialKeyframe(imageKeyframes), { fill: 'forwards' });
  }

  const removeSnapshotsAndResetTarget = () => {
    image.remove();
    resetTargetStyles();
  };

  const transition = image.animate(imageKeyframes, animationOptions);

  transitions[shared.tag].push({
    animation: transition,
    snapshotPair: pair,
    cleanup: removeSnapshotsAndResetTarget,
  });

  const exitContent = image.children[0] as HTMLDivElement;
  const enterContent = image.children[1] as HTMLDivElement;

  if (shared.transitionOptions.delay) {
    exitContent.animate(getInitialKeyframe(prevSnapshot.transitionOptions.contentExitKeyframes), {
      fill: 'forwards',
    });
    enterContent.animate(getInitialKeyframe(nextSnapshot.transitionOptions.contentEnterKeyframes), {
      fill: 'forwards',
    });
  }

  const exitContentTransition = exitContent.animate(
    prevSnapshot.transitionOptions.contentExitKeyframes,
    animationOptions
  );
  const enterContentTransition = enterContent.animate(
    nextSnapshot.transitionOptions.contentEnterKeyframes,
    animationOptions
  );

  transitions[shared.tag].push(
    { animation: exitContentTransition, snapshotPair: pair, cleanup: removeSnapshotsAndResetTarget },
    { animation: enterContentTransition, snapshotPair: pair, cleanup: removeSnapshotsAndResetTarget }
  );
};

export default playMutationTransition;
