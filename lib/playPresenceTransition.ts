import getInitialKeyframe from './getInitialKeyframe';
import getTransitionRoot from './getTransitionRoot';
import hideElementNoTransition from './hideElementNoTransition';
import { activeTransitions } from './store';
import { Keyframes, PresenceSnapshotPair } from './types';

const playTransition = (
  image: HTMLDivElement,
  transitionRoot: HTMLElement,
  keyframes: Keyframes,
  pair: PresenceSnapshotPair,
  resetTargetStyles?: (() => void) | null
) => {
  const { shared } = pair;
  transitionRoot.append(image);

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

  activeTransitions[shared.tag].push({
    snapshotPair: pair,
    animation: transition,
    cleanup: () => {
      image.remove();
      resetTargetStyles?.();
    },
  });

  return transition.finished;
};

const playPresenceTransition = async (pair: PresenceSnapshotPair) => {
  const { shared, prevSnapshot, nextSnapshot, prevImage, nextImage } = pair;
  const transitionRoot = shared.transitionRoot ?? getTransitionRoot();
  const resetTargetStyles = nextSnapshot?.targetElement ? hideElementNoTransition(nextSnapshot.targetElement) : null;
  activeTransitions[shared.tag] = [];

  await Promise.all([
    (async () => {
      if (!prevSnapshot || !prevImage) {
        return;
      }

      await playTransition(
        prevImage,
        transitionRoot,
        prevSnapshot.transitionOptions.exitKeyframes,
        pair,
        resetTargetStyles
      );
    })(),

    (async () => {
      if (!nextSnapshot || !nextImage) {
        return;
      }

      await playTransition(
        nextImage,
        transitionRoot,
        nextSnapshot.transitionOptions.enterKeyframes,
        pair,
        resetTargetStyles
      );
    })(),
  ]);
};

export default playPresenceTransition;
