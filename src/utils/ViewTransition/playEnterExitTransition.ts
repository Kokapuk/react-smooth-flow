import { Snapshot, ViewTransitionConfig } from '.';
import getViewTransitionRoot from './getViewTransitionRoot';

const playEnterExitTransition = async (
  targetElement: HTMLElement | null,
  prevSnapshot: Snapshot | null,
  nextSnapshot: Snapshot | null,
  config: ViewTransitionConfig
) => {
  const viewTransitionRoot = getViewTransitionRoot();

  const resetVisibility = targetElement?.style.visibility;
  if (targetElement) {
    targetElement.style.visibility = 'hidden';
  }

  if (prevSnapshot) {
    viewTransitionRoot.append(prevSnapshot.image);

    const exitAnimation = prevSnapshot.image.animate(
      prevSnapshot.viewTransitionProperties.exitKeyframes ?? [{ opacity: '1' }, { opacity: '0' }],
      {
        duration: config.duration,
        easing: config.easing ?? 'ease',
      }
    );

    await exitAnimation.finished;
    prevSnapshot.image.remove();
  } else if (nextSnapshot) {
    viewTransitionRoot.append(nextSnapshot.image);

    const enterAnimation = nextSnapshot.image.animate(
      nextSnapshot.viewTransitionProperties.enterKeyframes ?? [{ opacity: '0' }, { opacity: '1' }],
      {
        duration: config.duration,
        easing: config.easing ?? 'ease',
      }
    );

    await enterAnimation.finished;
    nextSnapshot.image.remove();
  }

  if (targetElement && resetVisibility !== undefined) {
    targetElement.style.visibility = resetVisibility;
  }
};

export default playEnterExitTransition;
