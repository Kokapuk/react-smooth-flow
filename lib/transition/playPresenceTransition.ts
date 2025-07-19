import getInitialKeyframe from '../getInitialKeyframe';
import { Keyframes, PresenceSnapshotPair, Snapshot, TransitionsRecord } from '../types';
import extractPropertyKeyframes from './extractPropertyKeyframes';
import hideElementNoTransition from './hideElementNoTransition';

const playTransition = (
  image: HTMLElement,
  snapshot: Snapshot,
  pair: PresenceSnapshotPair,
  keyframes: Keyframes,
  transitions: TransitionsRecord,
  type: 'enter' | 'exit',
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

    transitions[type === 'enter' ? 'presence_transformEnter' : 'presence_transformExit'] = {
      snapshotPair: pair,
      animation: transformTransition,
      keyframes: transformKeyframes,
    };

    transitions[type === 'enter' ? 'presence_restEnter' : 'presence_restExit'] = {
      snapshotPair: pair,
      animation: restTransition,
      keyframes: restKeyframes,
      cleanup: () => {
        image.remove();
        resetTarget?.();
      },
    };
  } else {
    if (snapshot.transitionOptions.delay) {
      image.animate(getInitialKeyframe(keyframes), { fill: 'forwards' });
    }

    const transition = image.animate(keyframes, animationOptions);
    // applyTransitionStartTimeByCapturedProgress(
    //   transition,
    //   keyframes,
    //   pair.shared.tag,
    //   type === 'enter' ? 'presence_restEnter' : 'presence_restExit'
    // );

    transitions[type === 'enter' ? 'presence_restExit' : 'presence_restEnter'] = {
      snapshotPair: pair,
      animation: transition,
      keyframes,
      cleanup: () => {
        image.remove();
        resetTarget?.();
      },
    };
  }
};

const playPresenceTransition = (pair: PresenceSnapshotPair, transitions: TransitionsRecord) => {
  const { prevSnapshot, nextSnapshot, prevImage, nextImage } = pair;
  const resetTarget = nextSnapshot?.target ? hideElementNoTransition(nextSnapshot.target) : null;

  if (prevSnapshot && prevImage) {
    playTransition(
      prevImage,
      prevSnapshot,
      pair,
      prevSnapshot.transitionOptions.exitKeyframes,
      transitions,
      'enter',
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
      'exit',
      !prevSnapshot ? resetTarget : null
    );
  }
};

export default playPresenceTransition;
