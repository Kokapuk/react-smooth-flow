import getTransitionRoot from './getTransitionRoot';
import hideElementNoTransition from './hideElementNoTransition';
import { activeTransitions } from './store';
import { Snapshot, TransitionConfig } from './types';

const playEnterExitTransition = async (
  targetElement: HTMLElement | null,
  prevSnapshot: Snapshot | null,
  nextSnapshot: Snapshot | null,
  config: TransitionConfig
) => {
  const transitionRoot = prevSnapshot?.transitionRoot ?? nextSnapshot?.transitionRoot ?? getTransitionRoot();

  const resetTargetStyles = targetElement ? hideElementNoTransition(targetElement) : undefined;

  await Promise.all([
    (async () => {
      if (!prevSnapshot) {
        return;
      }

      transitionRoot.append(prevSnapshot.image);

      const exitTransition = prevSnapshot.image.animate(prevSnapshot.transitionProperties.exitKeyframes, {
        duration: config.duration,
        easing: config.easing ?? 'ease',
      });

      activeTransitions[prevSnapshot.tag] = [
        { transition: exitTransition, onCancel: () => prevSnapshot.image.remove() },
      ];

      try {
        await exitTransition.finished;
        delete activeTransitions[prevSnapshot.tag];

        prevSnapshot.image.remove();
      } catch {
        /* empty */
      }
    })(),

    (async () => {
      if (!nextSnapshot) {
        return;
      }

      transitionRoot.append(nextSnapshot.image);

      const enterTransition = nextSnapshot.image.animate(nextSnapshot.transitionProperties.enterKeyframes, {
        duration: config.duration,
        easing: config.easing ?? 'ease',
      });

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
        delete activeTransitions[nextSnapshot.tag];

        removeSnapshotAndResetTarget();
      } catch {
        /* empty */
      }
    })(),
  ]);

  resetTargetStyles?.();
};

export default playEnterExitTransition;
