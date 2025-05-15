import adjustBoundsToRoot from '@lib/snapshot/adjustBoundsToRoot';
import getInitialKeyframe from '../getInitialKeyframe';
import { Keyframes, PropertyIndexedKeyframes, Snapshot, SnapshotPair, Transition } from '../types';
import applyPositionToSnapshotPairs from './applyPositionToSnapshotPairs';
import getOverlayRoot from './getOverlayRoot';

const createLayoutProxy = (display: string) => {
  const proxy = document.createElement('rsf-layout-proxy');
  proxy.inert = true;
  proxy.style.display = display;

  return proxy;
};

const fillKeyframesWithSnapshot = (keyframes: PropertyIndexedKeyframes, snapshot: Snapshot) => {
  if (snapshot.transitionOptions.transitionLayout) {
    (keyframes.width as string[]).push(`${snapshot.bounds.width}px`);
    (keyframes.height as string[]).push(`${snapshot.bounds.height}px`);
    (keyframes.margin as string[]).push(snapshot.computedStyle.margin);
  } else {
    (keyframes.width as string[]).push('0px');
    (keyframes.height as string[]).push('0px');
    (keyframes.margin as string[]).push('0px');
  }
};

const getFlexboxMarginCompensation = (element: HTMLElement) => {
  const computedStyle = window.getComputedStyle(element);
  const rowGap = computedStyle.rowGap;
  const columnGap = computedStyle.columnGap;

  const topMarginCompensation = rowGap === 'normal' ? '0' : `-${rowGap}`;
  const leftMarginCompensation = columnGap === 'normal' ? '0' : `-${columnGap}`;

  return `${topMarginCompensation} 0 0 ${leftMarginCompensation}`;
};

const playMutationTransition = (
  pair: SnapshotPair,
  transitions: Transition[],
  animationOptions: KeyframeAnimationOptions
) => {
  const { prevSnapshot, nextSnapshot, shared } = pair;

  if (!prevSnapshot || !nextSnapshot) {
    return;
  }

  const { target } = nextSnapshot;
  const layoutProxy = createLayoutProxy(nextSnapshot.computedStyle.display);

  const resetDisplayValue = target.style.getPropertyValue('display');
  const resetDisplayPriority = target.style.getPropertyPriority('display');

  target.style.setProperty('display', 'none', 'important');
  target.after(layoutProxy);

  const keyframes: Keyframes = {
    width: [],
    height: [],
    margin: [],
  };
  fillKeyframesWithSnapshot(keyframes, prevSnapshot);
  fillKeyframesWithSnapshot(keyframes, nextSnapshot);

  if (shared.transitionOptions.delay) {
    layoutProxy.animate(getInitialKeyframe(keyframes), { fill: 'forwards' });
  }

  const transition = layoutProxy.animate(keyframes, animationOptions);

  transitions.push({
    animation: transition,
    snapshotPair: pair,
    cleanup: () => {
      target.style.setProperty('display', resetDisplayValue, resetDisplayPriority);
      layoutProxy.remove();
    },
  });
};

const prepareExitTransition = (
  pair: SnapshotPair,
  transitions: Transition[],
  animationOptions: KeyframeAnimationOptions
) => {
  const { prevSnapshot, shared } = pair;

  if (!prevSnapshot) {
    return {};
  }

  const {
    targetDOMPosition: { parentElement, index },
  } = prevSnapshot;
  const layoutProxy = createLayoutProxy(prevSnapshot.computedStyle.display);

  if (!parentElement) {
    return {};
  }

  parentElement.insertBefore(layoutProxy, parentElement.children[index] ?? null);

  layoutProxy.style.width = `${prevSnapshot.bounds.width}px`;
  layoutProxy.style.height = `${prevSnapshot.bounds.height}px`;
  layoutProxy.style.margin = prevSnapshot.computedStyle.margin;

  return {
    layoutProxy,
    animate: () => {
      const keyframes: Keyframes = {
        width: [`${prevSnapshot.bounds.width}px`, `0px`],
        height: [`${prevSnapshot.bounds.height}px`, `0px`],
        margin: [prevSnapshot.computedStyle.margin, getFlexboxMarginCompensation(parentElement)],
      };

      if (shared.transitionOptions.delay) {
        layoutProxy.animate(getInitialKeyframe(keyframes), { fill: 'forwards' });
      }

      const transition = layoutProxy.animate(keyframes, animationOptions);

      transitions.push({
        animation: transition,
        snapshotPair: pair,
        cleanup: () => layoutProxy.remove(),
      });
    },
  };
};

const prepareEnterTransition = (
  pair: SnapshotPair,
  transitions: Transition[],
  animationOptions: KeyframeAnimationOptions
) => {
  const { nextSnapshot, shared } = pair;

  if (!nextSnapshot) {
    return {};
  }

  const { target } = nextSnapshot;

  const layoutProxy = createLayoutProxy(nextSnapshot.computedStyle.display);

  const resetDisplayValue = target.style.getPropertyValue('display');
  const resetDisplayPriority = target.style.getPropertyPriority('display');

  target.style.setProperty('display', 'none', 'important');
  target.after(layoutProxy);

  layoutProxy.style.width = `${nextSnapshot.bounds.width}px`;
  layoutProxy.style.height = `${nextSnapshot.bounds.height}px`;
  layoutProxy.style.margin = nextSnapshot.computedStyle.margin;

  return {
    layoutProxy,
    animate: () => {
      const keyframes: Keyframes = {
        width: [`0px`, `${nextSnapshot.bounds.width}px`],
        height: [`0px`, `${nextSnapshot.bounds.height}px`],
        margin: [
          getFlexboxMarginCompensation(nextSnapshot.targetDOMPosition.parentElement),
          nextSnapshot.computedStyle.margin,
        ],
      };

      if (shared.transitionOptions.delay) {
        layoutProxy.animate(getInitialKeyframe(keyframes), { fill: 'forwards' });
      }

      const transition = layoutProxy.animate(keyframes, animationOptions);

      transitions.push({
        animation: transition,
        snapshotPair: pair,
        cleanup: () => {
          target.style.setProperty('display', resetDisplayValue, resetDisplayPriority);
          layoutProxy.remove();
        },
      });
    },
  };
};

const playLayoutTransition = (pair: SnapshotPair, transitions: Transition[]) => {
  const { shared, prevSnapshot, nextSnapshot } = pair;

  const animationOptions: KeyframeAnimationOptions = {
    duration: shared.transitionOptions.duration,
    easing: shared.transitionOptions.easing,
    delay: shared.transitionOptions.delay,
    fill: 'forwards',
  };

  if (
    prevSnapshot &&
    nextSnapshot &&
    prevSnapshot.targetDOMPosition.parentElement === nextSnapshot.targetDOMPosition.parentElement &&
    prevSnapshot.targetDOMPosition.index === nextSnapshot.targetDOMPosition.index
  ) {
    playMutationTransition(pair, transitions, animationOptions);
  } else {
    const overlayRoot = getOverlayRoot();

    if (prevSnapshot?.transitionOptions.transitionLayout) {
      const { layoutProxy, animate } = prepareExitTransition(pair, transitions, animationOptions);

      if (layoutProxy) {
        if (pair.transitionType === 'presence' && prevSnapshot.transitionOptions.useLayoutProxyAsRoot) {
          const { prevImage } = pair;
          const root = prevSnapshot.root ?? overlayRoot;

          if (prevImage) {
            layoutProxy.appendChild(root.removeChild(prevImage));
            adjustBoundsToRoot(prevSnapshot.bounds, layoutProxy);
          }
        }

        animate();

        if (prevSnapshot.transitionOptions.useLayoutProxyAsRoot) {
          applyPositionToSnapshotPairs([pair]);
        }
      }
    }

    if (nextSnapshot?.transitionOptions.transitionLayout) {
      const { layoutProxy, animate } = prepareEnterTransition(pair, transitions, animationOptions);

      if (layoutProxy) {
        if (pair.transitionType === 'presence' && nextSnapshot.transitionOptions.useLayoutProxyAsRoot) {
          const { nextImage } = pair;
          const root = nextSnapshot.root ?? overlayRoot;

          if (nextImage) {
            layoutProxy.appendChild(root.removeChild(nextImage));
            adjustBoundsToRoot(nextSnapshot.bounds, layoutProxy);
          }
        }

        animate();

        if (nextSnapshot.transitionOptions.useLayoutProxyAsRoot) {
          applyPositionToSnapshotPairs([pair]);
        }
      }
    }
  }
};

export default playLayoutTransition;
