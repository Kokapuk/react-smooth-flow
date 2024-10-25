import { Snapshot, TransitionSnapshot, ViewTransitionConfig } from './types';
import getViewTransitionRoot from './getViewTransitionRoot';

const playEnterExitTransition = async (
  targetElement: HTMLElement | null,
  prevSnapshot: Snapshot | null,
  nextSnapshot: Snapshot | null,
  config: ViewTransitionConfig,
  activeTransitions: { [key: string]: TransitionSnapshot[] }
) => {
  const viewTransitionRoot = getViewTransitionRoot();

  const targetResetStyles: TransitionSnapshot['targetResetStyles'] = targetElement
    ? {
        opacity: targetElement.style.opacity,
        transition: targetElement.style.transition,
        pointerEvents: targetElement.style.pointerEvents,
      }
    : undefined;

  if (targetElement) {
    targetElement.style.opacity = '0';
    targetElement.style.transition = 'none';
    targetElement.style.pointerEvents = 'none';
  }

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

      const exitTransition = prevSnapshot.image.animate(exitKeyframes ?? [{ opacity: '1' }, { opacity: '0' }], {
        duration: config.duration,
        easing: config.easing ?? 'ease',
      });

      activeTransitions[prevSnapshot.viewTransitionProperties.tag] = [
        { transition: exitTransition, prevSnapshotImage: prevSnapshot.image },
      ];

      try {
        await exitTransition.finished;
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
        nextSnapshot.viewTransitionProperties.enterKeyframes ?? [{ opacity: '0' }, { opacity: '1' }],
        {
          duration: config.duration,
          easing: config.easing ?? 'ease',
        }
      );

      activeTransitions[nextSnapshot.viewTransitionProperties.tag] = [
        {
          transition: enterTransition,
          prevSnapshotImage: nextSnapshot.image,
          targetElement: targetElement as HTMLElement,
          targetResetStyles,
        },
      ];

      try {
        await enterTransition.finished;
        nextSnapshot.image.remove();
      } catch {
        /* empty */
      }
    })(),
  ]);

  if (targetElement && targetResetStyles) {
    targetElement.style.opacity = targetResetStyles.opacity;
    targetElement.style.pointerEvents = targetResetStyles.pointerEvents;
    setTimeout(() => (targetElement.style.transition = targetResetStyles.transition));
  }
};

export default playEnterExitTransition;
