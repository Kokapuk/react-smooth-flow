import { Snapshot, TransitionSnapshot, ViewTransitionConfig } from './types';
import getViewTransitionRoot from './getViewTransitionRoot';

const playMutationTransition = async (
  targetElement: HTMLElement,
  prevSnapshot: Snapshot,
  nextSnapshot: Snapshot,
  config: ViewTransitionConfig,
  activeTransitions: { [key: string]: TransitionSnapshot[] }
) => {
  const viewTransitionRoot = getViewTransitionRoot();

  const resetVisibility = targetElement.style.visibility;

  if (!config.suppressHidingTags?.includes(prevSnapshot.viewTransitionProperties.tag)) {
    targetElement.style.visibility = 'hidden';
  }

  viewTransitionRoot.append(prevSnapshot.image);
  viewTransitionRoot.append(nextSnapshot.image);

  const keyframes = [prevSnapshot, nextSnapshot].map((i) => ({
    width: `${i.rect.width}px`,
    height: `${i.rect.height}px`,
    left: `${i.rect.left}px`,
    top: `${i.rect.top}px`,
    backgroundColor: i.computedStyle.backgroundColor,
    borderRadius: i.computedStyle.borderRadius,
    borderWidth: i.computedStyle.borderWidth,
    borderColor: i.computedStyle.borderColor,
    borderStyle: i.computedStyle.borderStyle,
  }));

  const prevTransition = prevSnapshot.image.animate(
    [{ opacity: '1', ...keyframes[0] }, { opacity: '1' }, { opacity: '0', ...keyframes[1] }],
    {
      duration: config.duration,
      easing: config.easing ?? 'ease',
    }
  );
  const nextTransition = nextSnapshot.image.animate(
    [{ opacity: '0', ...keyframes[0] }, { opacity: '1' }, { opacity: '1', ...keyframes[1] }],
    {
      duration: config.duration,
      easing: config.easing ?? 'ease',
    }
  );

  activeTransitions[prevSnapshot.viewTransitionProperties.tag] = [prevTransition, nextTransition].map((i) => ({
    transition: i,
    prevSnapshotImage: prevSnapshot.image,
    nextSnapshotImage: nextSnapshot.image,
    targetElement,
    targetResetVisibility: resetVisibility,
  }));

  try {
    await prevTransition.finished;
    await nextTransition.finished;

    activeTransitions[prevSnapshot.viewTransitionProperties.tag] = [];

    prevSnapshot.image.remove();
    nextSnapshot.image.remove();
    targetElement.style.visibility = resetVisibility;
  } catch {
    /* empty */
  }
};

export default playMutationTransition;
