import getInitialKeyframe from './getInitialKeyframe';
import { Keyframes, SnapshotPair, Transition } from './types';

const createLayoutProxy = (display: string) => {
  const proxy = document.createElement('rsf-layout-proxy');
  proxy.inert = true;
  proxy.style.display = display;

  return proxy;
};

const getFlexboxMarginCompensation = (target: HTMLElement) => {
  const computedStyle = window.getComputedStyle(target);
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

  const { targetElement } = nextSnapshot;
  const layoutProxy = createLayoutProxy(nextSnapshot.computedStyle.display);

  const resetDisplay = targetElement.style.display;
  targetElement.style.setProperty('display', 'none', 'important');
  targetElement.after(layoutProxy);

  const keyframes: Keyframes = {
    width: [`${prevSnapshot?.bounds.width}px`, `${nextSnapshot.bounds.width}px`],
    height: [`${prevSnapshot?.bounds.height}px`, `${nextSnapshot.bounds.height}px`],
    margin: [prevSnapshot?.computedStyle.margin, nextSnapshot.computedStyle.margin],
  };

  if (shared.transitionOptions.delay) {
    layoutProxy.animate(getInitialKeyframe(keyframes), { fill: 'forwards' });
  }

  const transition = layoutProxy.animate(keyframes, animationOptions);

  transitions.push({
    animation: transition,
    snapshotPair: pair,
    cleanup: () => {
      targetElement.style.setProperty('display', resetDisplay);
      layoutProxy.remove();
    },
  });
};

const playEnterTransition = (
  pair: SnapshotPair,
  transitions: Transition[],
  animationOptions: KeyframeAnimationOptions
) => {
  const { nextSnapshot, shared } = pair;

  if (!nextSnapshot) {
    return;
  }

  const { targetElement } = nextSnapshot;

  const layoutProxy = createLayoutProxy(nextSnapshot.computedStyle.display);

  const resetDisplay = targetElement.style.display;
  targetElement.style.setProperty('display', 'none', 'important');
  targetElement.after(layoutProxy);

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
      targetElement.style.setProperty('display', resetDisplay);
      layoutProxy.remove();
    },
  });
};

const playExitTransition = (
  pair: SnapshotPair,
  transitions: Transition[],
  animationOptions: KeyframeAnimationOptions
) => {
  const { prevSnapshot, shared } = pair;

  if (!prevSnapshot) {
    return;
  }

  const {
    targetDOMPosition: { parentElement, index },
  } = prevSnapshot;
  const layoutProxy = createLayoutProxy(prevSnapshot.computedStyle.display);

  if (!parentElement) {
    return;
  }

  parentElement.insertBefore(layoutProxy, parentElement.children[index] ?? null);

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
    if (nextSnapshot) {
      playEnterTransition(pair, transitions, animationOptions);
    }

    if (prevSnapshot) {
      playExitTransition(pair, transitions, animationOptions);
    }
  }
};

export default playLayoutTransition;
