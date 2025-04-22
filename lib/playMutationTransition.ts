import { STYLE_PROPERTIES_TO_ANIMATE } from './defaults';
import getInitialKeyframe from './getInitialKeyframe';
import hideElementNoTransition from './hideElementNoTransition';
import parseTransformMatrix from './parseTransformMatrix';
import { ContentAlign, Keyframes, MutationSnapshotPair, Transition } from './types';

const playImageTransition = (
  pair: MutationSnapshotPair,
  animationOptions: KeyframeAnimationOptions,
  transitions: Transition[],
  cleanup: () => void
) => {
  const { prevSnapshot, nextSnapshot, shared, image } = pair;
  const generalKeyframes = [prevSnapshot, nextSnapshot].map((snapshot) => {
    const keyframe: Record<string, string | number> = {
      width: `${snapshot.bounds.width}px`,
      height: `${snapshot.bounds.height}px`,
    };

    STYLE_PROPERTIES_TO_ANIMATE.forEach((property) => (keyframe[property] = snapshot.computedStyle[property]));

    return keyframe;
  });

  let transform = '';
  const translateYTop = prevSnapshot.bounds.top - nextSnapshot.bounds.top;
  const translateRight = nextSnapshot.bounds.right - prevSnapshot.bounds.right;
  const translateYBottom = nextSnapshot.bounds.bottom - prevSnapshot.bounds.bottom;
  const translateXLeft = prevSnapshot.bounds.left - nextSnapshot.bounds.left;

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
    { ...generalKeyframes[0], transform: transform },
    { ...generalKeyframes[1], transform: 'translate(0, 0)' },
  ];

  if (shared.transitionOptions.delay) {
    image.animate(getInitialKeyframe(keyframes), { fill: 'forwards' });
  }

  const transition = image.animate(keyframes, animationOptions);

  transitions.push({
    animation: transition,
    snapshotPair: pair,
    cleanup,
  });
};

const playContentTransition = (
  pair: MutationSnapshotPair,
  animationOptions: KeyframeAnimationOptions,
  transitions: Transition[],
  cleanup: () => void
) => {
  const { image, shared, prevSnapshot, nextSnapshot } = pair;
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

  transitions.push(
    { animation: exitContentTransition, snapshotPair: pair, cleanup },
    { animation: enterContentTransition, snapshotPair: pair, cleanup }
  );
};

const applyTransformOriginToContent = (contentAlign: ContentAlign, target: HTMLDivElement) => {
  switch (contentAlign) {
    case 'topLeft':
      target.style.transformOrigin = 'top left';
      break;
    case 'topCenter':
      target.style.transformOrigin = 'top center';
      break;
    case 'topRight':
      target.style.transformOrigin = 'top right';
      break;
    case 'centerRight':
      target.style.transformOrigin = 'center right';
      break;
    case 'bottomRight':
      target.style.transformOrigin = 'bottom right';
      break;
    case 'bottomCenter':
      target.style.transformOrigin = 'bottom center';
      break;
    case 'bottomLeft':
      target.style.transformOrigin = 'bottom left';
      break;
    case 'centerLeft':
      target.style.transformOrigin = 'center left';
      break;
    case 'center':
      target.style.transformOrigin = 'center';
      break;
  }
};

const playContentScaleTransition = (
  pair: MutationSnapshotPair,
  animationOptions: KeyframeAnimationOptions,
  transitions: Transition[],
  cleanup: () => void
) => {
  const { prevSnapshot, nextSnapshot, image, shared } = pair;

  if (prevSnapshot.transitionOptions.scaleContent) {
    const exitContentTransformContainer = image.children[0].children[0] as HTMLDivElement;
    applyTransformOriginToContent(prevSnapshot.transitionOptions.contentAlign, exitContentTransformContainer);

    const exitContentMatrix = parseTransformMatrix(getComputedStyle(exitContentTransformContainer).transform);
    const exitContentFrom = exitContentMatrix.toString();
    exitContentMatrix.scaleX = nextSnapshot.bounds.width / prevSnapshot.bounds.width;
    exitContentMatrix.scaleY = nextSnapshot.bounds.height / prevSnapshot.bounds.height;
    const exitContentScaleAnimation: Keyframes = { transform: [exitContentFrom, exitContentMatrix.toString()] };

    if (shared.transitionOptions.delay) {
      exitContentTransformContainer.animate(getInitialKeyframe(exitContentScaleAnimation), {
        fill: 'forwards',
      });
    }

    const exitContentScaleTransition = exitContentTransformContainer.animate(
      exitContentScaleAnimation,
      animationOptions
    );

    transitions.push({ animation: exitContentScaleTransition, snapshotPair: pair, cleanup });
  }

  if (nextSnapshot.transitionOptions.scaleContent) {
    const enterContentTransformContainer = image.children[1].children[0] as HTMLDivElement;

    applyTransformOriginToContent(nextSnapshot.transitionOptions.contentAlign, enterContentTransformContainer);

    const enterContentMatrix = parseTransformMatrix(getComputedStyle(enterContentTransformContainer).transform);
    const enterContentTo = enterContentMatrix.toString();
    enterContentMatrix.scaleX = prevSnapshot.bounds.width / nextSnapshot.bounds.width;
    enterContentMatrix.scaleY = prevSnapshot.bounds.height / nextSnapshot.bounds.height;
    const enterContentScaleAnimation: Keyframes = { transform: [enterContentMatrix.toString(), enterContentTo] };

    if (shared.transitionOptions.delay) {
      enterContentTransformContainer.animate(getInitialKeyframe(enterContentScaleAnimation), {
        fill: 'forwards',
      });
    }

    const enterContentScaleTransition = enterContentTransformContainer.animate(
      enterContentScaleAnimation,
      animationOptions
    );

    transitions.push({ animation: enterContentScaleTransition, snapshotPair: pair, cleanup });
  }
};

const playMutationTransition = (pair: MutationSnapshotPair, transitions: Transition[]) => {
  const { prevSnapshot, nextSnapshot, image, shared } = pair;
  const resetTargetStyles = hideElementNoTransition(nextSnapshot.targetElement);

  const animationOptions: KeyframeAnimationOptions = {
    duration: shared.transitionOptions.duration,
    easing: shared.transitionOptions.easing,
    delay: shared.transitionOptions.delay,
    fill: 'forwards',
  };

  const removeSnapshotsAndResetTarget = () => {
    image.remove();
    resetTargetStyles();
  };

  playImageTransition(pair, animationOptions, transitions, removeSnapshotsAndResetTarget);
  playContentTransition(pair, animationOptions, transitions, removeSnapshotsAndResetTarget);

  if (prevSnapshot.transitionOptions.scaleContent || nextSnapshot.transitionOptions.scaleContent) {
    playContentScaleTransition(pair, animationOptions, transitions, removeSnapshotsAndResetTarget);
  }
};

export default playMutationTransition;
