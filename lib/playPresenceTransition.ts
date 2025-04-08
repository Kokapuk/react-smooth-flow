import getInitialKeyframe from './getInitialKeyframe';
import hideElementNoTransition from './hideElementNoTransition';
import { Keyframes, PresenceSnapshotPair, Tag, Transition } from './types';

const playTransition = (
  image: HTMLDivElement,
  keyframes: Keyframes,
  pair: PresenceSnapshotPair,
  transitions: Record<Tag, Transition[]>,
  resetTargetStyles?: (() => void) | null
) => {
  const { shared } = pair;

  if (shared.transitionOptions.delay) {
    image.animate(getInitialKeyframe(keyframes), {
      fill: 'forwards',
    });
  }

  const transition = image.animate(keyframes, {
    duration: shared.transitionOptions.duration,
    easing: shared.transitionOptions.easing,
    delay: shared.transitionOptions.delay,
    fill: 'forwards',
  });

  transitions[shared.tag].push({
    snapshotPair: pair,
    animation: transition,
    cleanup: () => {
      image.remove();
      resetTargetStyles?.();
    },
  });

  return transition.finished;
};

const playPresenceTransition = (pair: PresenceSnapshotPair, transitions: Record<Tag, Transition[]>) => {
  const { shared, prevSnapshot, nextSnapshot, prevImage, nextImage } = pair;
  const resetTargetStyles = nextSnapshot?.targetElement ? hideElementNoTransition(nextSnapshot.targetElement) : null;
  transitions[shared.tag] = [];

  if (prevSnapshot && prevImage) {
    playTransition(prevImage, prevSnapshot.transitionOptions.exitKeyframes, pair, transitions, resetTargetStyles);
  }

  if (nextSnapshot && nextImage) {
    playTransition(nextImage, nextSnapshot.transitionOptions.enterKeyframes, pair, transitions, resetTargetStyles);
  }
};

export default playPresenceTransition;
