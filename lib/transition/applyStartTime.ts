import { Keyframes, Tag, TransitionKey } from '@lib/types';
import stableStringify from 'json-stable-stringify';
import { TransitionProgresses } from './transitionProgressManager';

const applyStartTime = (
  tag: Tag,
  keyframes: Keyframes,
  transitionProgresses: Record<Tag, TransitionProgresses>,
  transitionKey: TransitionKey,
  animation: Animation
) => {
  const transitionProgress = transitionProgresses[tag][transitionKey];

  if (!transitionProgress) {
    return;
  }

  if (stableStringify(keyframes) !== stableStringify(transitionProgress.keyframes)) {
    return;
  }

  animation.startTime = (animation.effect!.getComputedTiming().duration as number) * (1 - transitionProgress.progress);
};

export default applyStartTime;
