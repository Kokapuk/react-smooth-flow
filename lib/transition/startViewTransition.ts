import getCssKeyframes from '@lib/getCssKeyframes';
import isMotionReduced from '@lib/isMotionReduced';
import { getTransitioned, getTransitionMapping } from '@lib/registry/store';
import getTruthyArray from '../getTruthyArray';
import { FalsyArray, Tag, UpdateCallback, ViewTransitionConfig } from '../types';
import getAllTags from './getAllTags';

const startViewTransition = (tags: FalsyArray<Tag>, update?: UpdateCallback, config?: ViewTransitionConfig) => {
  if (!document.startViewTransition) {
    throw Error('View transition is not supported in current browser');
  }

  const validTags = Array.from(new Set(getTruthyArray(tags)));
  const allTags = getAllTags(validTags);
  const style = document.createElement('style');

  style.innerText = `::view-transition-group(*) {animation-duration: 0ms;}`;

  const prefersReducedMotion = isMotionReduced();

  const elements = allTags.map((tag) => {
    const element = getTransitioned(tag);

    if (!element) {
      return null;
    }

    const viewTransitionName = `rsf-${tag}`;
    const transitionMapping = getTransitionMapping(element)!;
    const transitionOptions = transitionMapping[tag];

    if (
      !transitionOptions.viewTransitionPlayMutationTransition &&
      !transitionOptions.viewTransitionPlayPresenceTransition
    ) {
      return null;
    }

    if (prefersReducedMotion && !transitionOptions.ignoreReducedMotion) {
      return null;
    }

    element.style.setProperty('view-transition-name', viewTransitionName, 'important');

    const enterAnimationName = `rsf-enter-${tag}`;
    const exitAnimationName = `rsf-exit-${tag}`;

    if (transitionOptions.viewTransitionPlayPresenceTransition) {
      style.innerText += `@keyframes ${enterAnimationName} {${getCssKeyframes(transitionOptions.enterKeyframes)}}`;
      style.innerText += `@keyframes ${exitAnimationName} {${getCssKeyframes(transitionOptions.exitKeyframes)}}`;
    }

    style.innerText += `::view-transition-group(${viewTransitionName}) {
      ${!transitionOptions.viewTransitionPlayMutationTransition ? 'animation: none;' : ''}
      animation-duration: ${transitionOptions.duration}ms;
      animation-delay: ${transitionOptions.delay}ms;
      animation-timing-function: ${transitionOptions.easing};
    }`;

    if (transitionOptions.viewTransitionPlayPresenceTransition) {
      style.innerText += `::view-transition-old(${viewTransitionName}) {animation-name: ${exitAnimationName};}`;
      style.innerText += `::view-transition-new(${viewTransitionName}) {animation-name: ${enterAnimationName};}`;
    }

    return element;
  });

  if (!elements.some((element) => element !== null)) {
    update?.();
    return null;
  }

  document.head.append(style);

  const transition = document.startViewTransition(update);
  config?.onBegin?.();

  (async () => {
    await transition.finished;
    config?.onFinish?.();

    elements.forEach((element) => {
      if (element) {
        element.style.removeProperty('view-transition-name');
      }
    });

    style.remove();
  })();

  return transition;
};

export default startViewTransition;
