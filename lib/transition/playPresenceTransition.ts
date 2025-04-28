import getInitialKeyframe from '../getInitialKeyframe';
import { Keyframes, PresenceSnapshotPair, Snapshot, Transition } from '../types';
import extractPropertyKeyframes from './extractPropertyKeyframes';
import hideElementNoTransition from './hideElementNoTransition';

const playTransition = (
  image: HTMLElement,
  snapshot: Snapshot,
  pair: PresenceSnapshotPair,
  keyframes: Keyframes,
  transitions: Transition[],
  resetTarget?: (() => void) | null
) => {
  const { transitionOptions } = snapshot;

  const animationOptions: KeyframeAnimationOptions = {
    duration: snapshot.transitionOptions.duration,
    easing: snapshot.transitionOptions.easing,
    delay: snapshot.transitionOptions.delay,
    fill: 'forwards',
  };

  if (transitionOptions.captureTransform) {
    const { propertyKeyframes: transformKeyframes, restKeyframes } = extractPropertyKeyframes(keyframes, 'transform');

    if (snapshot.transitionOptions.delay) {
      image.animate(getInitialKeyframe(transformKeyframes), { fill: 'forwards', composite: 'add' });
      image.animate(getInitialKeyframe(restKeyframes), { fill: 'forwards' });
    }

    const transformTransition = image.animate(transformKeyframes, { ...animationOptions, composite: 'add' });
    const restTransition = image.animate(restKeyframes, animationOptions);

    transitions.push({
      snapshotPair: pair,
      animation: transformTransition,
      cleanup: () => {
        image.remove();
        resetTarget?.();
      },
    });

    transitions.push({
      snapshotPair: pair,
      animation: restTransition,
      cleanup: () => image.remove(),
    });
  } else {
    if (snapshot.transitionOptions.delay) {
      image.animate(getInitialKeyframe(keyframes), { fill: 'forwards' });
    }

    const transition = image.animate(keyframes, animationOptions);

    transitions.push({
      snapshotPair: pair,
      animation: transition,
      cleanup: () => {
        image.remove();
        resetTarget?.();
      },
    });
  }
};

const playPresenceTransition = (pair: PresenceSnapshotPair, transitions: Transition[]) => {
  const { prevSnapshot, nextSnapshot, prevImage, nextImage } = pair;
  const resetTarget = nextSnapshot?.targetElement ? hideElementNoTransition(nextSnapshot.targetElement) : null;

  if (prevSnapshot && prevImage) {
    playTransition(
      prevImage,
      prevSnapshot,
      pair,
      prevSnapshot.transitionOptions.exitKeyframes,
      transitions,
      resetTarget
    );
  }

  if (nextSnapshot && nextImage) {
    playTransition(
      nextImage,
      nextSnapshot,
      pair,
      nextSnapshot.transitionOptions.enterKeyframes,
      transitions,
      !prevSnapshot ? resetTarget : null
    );
  }
};

export default playPresenceTransition;
