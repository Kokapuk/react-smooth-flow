import { Snapshot, ViewTransitionConfig } from '.';
import getViewTransitionRoot from './getViewTransitionRoot';

const playMutationTransition = async (
  targetElement: HTMLElement,
  prevSnapshot: Snapshot,
  nextSnapshot: Snapshot,
  config: ViewTransitionConfig
) => {
  const viewTransitionRoot = getViewTransitionRoot();

  const resetVisibility = targetElement.style.visibility;
  targetElement.style.visibility = 'hidden';

  viewTransitionRoot.append(prevSnapshot.image);
  viewTransitionRoot.append(nextSnapshot.image);

  const fromKeyframes = {
    width: `${prevSnapshot.rect.width}px`,
    height: `${prevSnapshot.rect.height}px`,
    left: `${prevSnapshot.rect.left}px`,
    top: `${prevSnapshot.rect.top}px`,
    backgroundColor: prevSnapshot.computedStyle.backgroundColor,
    borderRadius: prevSnapshot.computedStyle.borderRadius,
    borderWidth: prevSnapshot.computedStyle.borderWidth,
    borderColor: prevSnapshot.computedStyle.borderColor,
    borderStyle: prevSnapshot.computedStyle.borderStyle,
  };

  const toKeyFrames = {
    width: `${nextSnapshot.rect.width}px`,
    height: `${nextSnapshot.rect.height}px`,
    left: `${nextSnapshot.rect.left}px`,
    top: `${nextSnapshot.rect.top}px`,
    backgroundColor: nextSnapshot.computedStyle.backgroundColor,
    borderRadius: nextSnapshot.computedStyle.borderRadius,
    borderWidth: nextSnapshot.computedStyle.borderWidth,
    borderColor: nextSnapshot.computedStyle.borderColor,
    borderStyle: nextSnapshot.computedStyle.borderStyle,
  };

  const prevAnimation = prevSnapshot.image.animate([{ ...fromKeyframes }, { ...toKeyFrames }], {
    duration: config.duration,
    easing: config.easing ?? 'ease',
  });
  const nextAnimation = nextSnapshot.image.animate(
    [
      { opacity: '0', ...fromKeyframes },
      { opacity: '1', ...toKeyFrames },
    ],
    {
      duration: config.duration,
      easing: config.easing ?? 'ease',
    }
  );

  await prevAnimation.finished;
  await nextAnimation.finished;
  prevSnapshot.image.remove();
  nextSnapshot.image.remove();
  targetElement.style.visibility = resetVisibility;
};

export default playMutationTransition;