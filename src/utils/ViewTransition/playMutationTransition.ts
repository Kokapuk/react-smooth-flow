import getColorWithOpacity from './getColorWithOpacity';
import getViewTransitionRoot from './getViewTransitionRoot';
import hideElementNoTransition from './hideElementNoTransition';
import { Snapshot, TransitionSnapshot, ViewTransitionConfig } from './types';

export default async (
  targetElement: HTMLElement,
  prevSnapshot: Snapshot,
  nextSnapshot: Snapshot,
  config: ViewTransitionConfig,
  activeTransitions: { [key: string]: TransitionSnapshot[] }
) => {
  const viewTransitionRoot = getViewTransitionRoot();

  let resetTargetStyles: (() => void) | undefined = undefined;

  if (!config.suppressHidingTags?.includes(prevSnapshot.viewTransitionProperties.tag)) {
    resetTargetStyles = hideElementNoTransition(targetElement);
  }

  viewTransitionRoot.append(prevSnapshot.image);
  viewTransitionRoot.append(nextSnapshot.image);

  const keyframes = [prevSnapshot, nextSnapshot].map((i) => ({
    width: `${i.rect.width}px`,
    height: `${i.rect.height}px`,
    left: `${i.rect.left}px`,
    top: `${i.rect.top}px`,
    backgroundColor: getColorWithOpacity(i.computedStyle.backgroundColor, i.computedStyle.opacity),

    borderTopRightRadius: i.computedStyle.borderTopRightRadius,
    borderBottomRightRadius: i.computedStyle.borderBottomRightRadius,
    borderBottomLeftRadius: i.computedStyle.borderBottomLeftRadius,
    borderTopLeftRadius: i.computedStyle.borderTopLeftRadius,

    borderTopWidth: i.computedStyle.borderTopWidth,
    borderRightWidth: i.computedStyle.borderRightWidth,
    borderBottomWidth: i.computedStyle.borderBottomWidth,
    borderLeftWidth: i.computedStyle.borderLeftWidth,

    borderTopColor: i.computedStyle.borderTopColor,
    borderRightColor: i.computedStyle.borderRightColor,
    borderBottomColor: i.computedStyle.borderBottomColor,
    borderLeftColor: i.computedStyle.borderLeftColor,

    borderTopStyle: i.computedStyle.borderTopStyle,
    borderRightStyle: i.computedStyle.borderRightStyle,
    borderBottomStyle: i.computedStyle.borderBottomStyle,
    borderLeftStyle: i.computedStyle.borderLeftStyle,
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
    resetTargetStyles,
  }));

  try {
    await prevTransition.finished;
    await nextTransition.finished;

    activeTransitions[prevSnapshot.viewTransitionProperties.tag] = [];

    prevSnapshot.image.remove();
    nextSnapshot.image.remove();

    resetTargetStyles?.();
  } catch {
    /* empty */
  }
};
