import getInitialKeyframe from './getInitialKeyframe';
import getTransitionRoot from './getTransitionRoot';
import hideElementNoTransition from './hideElementNoTransition';
import { activeTransitions } from './store';
import { Snapshot, Tag } from './types';

const playEnterExitTransition = async (
  targetElement: HTMLElement | null,
  prevSnapshot: Snapshot | null,
  nextSnapshot: Snapshot | null
) => {
  const transitionRoot = prevSnapshot?.transitionRoot ?? nextSnapshot?.transitionRoot ?? getTransitionRoot();

  const resetTargetStyles = targetElement ? hideElementNoTransition(targetElement) : undefined;

  if (prevSnapshot || nextSnapshot) {
    activeTransitions[(prevSnapshot?.tag ?? nextSnapshot?.tag) as Tag] = [];
  }

  await Promise.all([
    (async () => {
      if (!prevSnapshot) {
        return;
      }

      transitionRoot.append(prevSnapshot.image);

      if (prevSnapshot.transitionProperties.delay) {
        prevSnapshot.image.animate(getInitialKeyframe(prevSnapshot.transitionProperties.exitKeyframes), {
          fill: 'forwards',
        });
      }

      const exitTransition = prevSnapshot.image.animate(prevSnapshot.transitionProperties.exitKeyframes, {
        duration: prevSnapshot.transitionProperties.duration,
        easing: prevSnapshot.transitionProperties.easing,
        delay: prevSnapshot.transitionProperties.delay,
        fill: 'forwards',
      });

      activeTransitions[prevSnapshot.tag].push({
        snapshot: prevSnapshot,
        transition: exitTransition,
        onCancel: () => prevSnapshot.image.remove(),
      });

      await exitTransition.finished;
    })(),

    (async () => {
      if (!nextSnapshot) {
        return;
      }

      transitionRoot.append(nextSnapshot.image);

      if (nextSnapshot.transitionProperties.delay) {
        nextSnapshot.image.animate(getInitialKeyframe(nextSnapshot.transitionProperties.enterKeyframes), {
          fill: 'forwards',
        });
      }

      const enterTransition = nextSnapshot.image.animate(nextSnapshot.transitionProperties.enterKeyframes, {
        duration: nextSnapshot.transitionProperties.duration,
        easing: nextSnapshot.transitionProperties.easing,
        delay: nextSnapshot.transitionProperties.delay,
        fill: 'forwards',
      });

      activeTransitions[nextSnapshot.tag].push({
        snapshot: nextSnapshot,
        transition: enterTransition,
        onCancel: () => {
          nextSnapshot.image.remove();
          resetTargetStyles?.();
        },
      });

      await enterTransition.finished;
    })(),
  ]);
};

export default playEnterExitTransition;
