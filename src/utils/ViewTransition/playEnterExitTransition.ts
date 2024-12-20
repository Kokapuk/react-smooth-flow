import getViewTransitionRoot from './getViewTransitionRoot';
import hideElementNoTransition from './hideElementNoTransition';
import { activeTransitions } from './store';
import { Snapshot, ViewTransitionConfig } from './types';

const playEnterExitTransition = async (
  targetElement: HTMLElement | null,
  prevSnapshot: Snapshot | null,
  nextSnapshot: Snapshot | null,
  config: ViewTransitionConfig
) => {
  const viewTransitionRoot =
    prevSnapshot?.viewTransitionRoot ?? nextSnapshot?.viewTransitionRoot ?? getViewTransitionRoot();

  const resetTargetStyles = targetElement ? hideElementNoTransition(targetElement) : undefined;

  await Promise.all([
    (async () => {
      if (!prevSnapshot) {
        return;
      }

      viewTransitionRoot.append(prevSnapshot.image);

      let exitKeyframes: Keyframe[] | undefined = undefined;

      if (
        prevSnapshot.viewTransitionProperties.exitKeyframes === 'reversedEnter' &&
        prevSnapshot.viewTransitionProperties.enterKeyframes
      ) {
        exitKeyframes = [...prevSnapshot.viewTransitionProperties.enterKeyframes].reverse();
      } else if (prevSnapshot.viewTransitionProperties.exitKeyframes !== 'reversedEnter') {
        exitKeyframes = prevSnapshot.viewTransitionProperties.exitKeyframes;
      }

      const exitTransition = prevSnapshot.image.animate(exitKeyframes ?? [{ opacity: 1 }, { opacity: 0 }], {
        duration: config.duration,
        easing: config.easing ?? 'ease',
      });

      activeTransitions[prevSnapshot.tag] = [
        { transition: exitTransition, onCancel: () => prevSnapshot.image.remove() },
      ];

      try {
        await exitTransition.finished;

        activeTransitions[prevSnapshot.tag] = [];
        prevSnapshot.image.remove();
      } catch {
        /* empty */
      }
    })(),

    (async () => {
      if (!nextSnapshot) {
        return;
      }

      viewTransitionRoot.append(nextSnapshot.image);

      const enterTransition = nextSnapshot.image.animate(
        nextSnapshot.viewTransitionProperties.enterKeyframes ?? [{ opacity: 0 }, { opacity: 1 }],
        {
          duration: config.duration,
          easing: config.easing ?? 'ease',
        }
      );

      const removeSnapshotAndResetTarget = () => {
        nextSnapshot.image.remove();
        resetTargetStyles?.();
      };

      activeTransitions[nextSnapshot.tag] = [
        {
          transition: enterTransition,
          onCancel: removeSnapshotAndResetTarget,
        },
      ];

      try {
        await enterTransition.finished;

        activeTransitions[nextSnapshot.tag] = [];
        removeSnapshotAndResetTarget();
      } catch {
        /* empty */
      }
    })(),
  ]);

  resetTargetStyles?.();
};

export default playEnterExitTransition;
