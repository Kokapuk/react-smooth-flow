import getInitialKeyframe from './getInitialKeyframe';
import getTransitionRoot from './getTransitionRoot';
import hideElementNoTransition from './hideElementNoTransition';
import { activeTransitions } from './store';
import { Keyframes, SnapshotPair, SnapshotPairSharedData } from './types';

const playTransition = (
  image: HTMLDivElement,
  transitionRoot: HTMLElement,
  keyframes: Keyframes,
  snapshotPairSharedData: SnapshotPairSharedData,
  resetTargetStyles?: (() => void) | null
) => {
  transitionRoot.append(image);

  if (snapshotPairSharedData.transitionProperties.delay) {
    image.animate(getInitialKeyframe(keyframes), {
      fill: 'forwards',
    });
  }

  const transition = image.animate(keyframes, {
    duration: snapshotPairSharedData.transitionProperties.duration,
    easing: snapshotPairSharedData.transitionProperties.easing,
    delay: snapshotPairSharedData.transitionProperties.delay,
    fill: 'forwards',
  });

  activeTransitions[snapshotPairSharedData.tag].push({
    snapshotPairSharedData,
    animation: transition,
    cleanup: () => {
      image.remove();
      resetTargetStyles?.();
    },
  });

  return transition.finished;
};

const playEnterExitTransition = async ({
  shared,
  prevSnapshot,
  nextSnapshot,
  prevImage,
  nextImage,
}: SnapshotPair<'enterExit'>) => {
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
        prevSnapshot.transitionProperties.exitKeyframes,
        shared,
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
        nextSnapshot.transitionProperties.enterKeyframes,
        shared,
        resetTargetStyles
      );
    })(),
  ]);
};

export default playEnterExitTransition;
