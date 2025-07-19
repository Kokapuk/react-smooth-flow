import { TRANSITION_KEYS_TO_CAPTURE_PROGRESS } from '@lib/defaults';
import { getRecordByTag } from '@lib/store';
import { Keyframes, Tag, TransitionKey } from '../types';
import getReversedKeyframes from '@lib/getReversedKeyframes';
import stableStringify from 'json-stable-stringify';

export type TransitionProgressRecord = { progress: number; keyframes: Keyframes };
export type TransitionProgresses = Partial<Record<TransitionKey, TransitionProgressRecord>>;

let capturedTransitionProgresses: Record<Tag, TransitionProgresses> = {};

export const captureTransitionProgresses = (tags: Tag[]) => {
  capturedTransitionProgresses = {};

  tags.forEach((tag) => {
    const record = getRecordByTag(tag);

    if (!record) {
      return;
    }

    capturedTransitionProgresses[tag] = {};

    Object.keys(TRANSITION_KEYS_TO_CAPTURE_PROGRESS).forEach((transitionKey) => {
      const typedTransitionKey = transitionKey as keyof typeof TRANSITION_KEYS_TO_CAPTURE_PROGRESS;
      const transition = record[tag][typedTransitionKey];

      if (!transition) {
        return;
      }

      capturedTransitionProgresses[tag][typedTransitionKey] = {
        progress: transition.animation.effect!.getComputedTiming().progress ?? 1,
        keyframes: transition.keyframes,
      };
    });
  });
};

export const applyTransitionStartTimeByCapturedProgress = (
  animation: Animation,
  keyframes: Keyframes,
  tag: Tag,
  transitionKey: TransitionKey
) => {
  const transitionProgressRecord = capturedTransitionProgresses[tag]?.[transitionKey];
  console.log(capturedTransitionProgresses)

  if (!transitionProgressRecord) {
    return;
  }

  if (stableStringify(getReversedKeyframes(keyframes)) !== stableStringify(transitionProgressRecord.keyframes)) {
    return;
  }

  animation.currentTime =
    (animation.effect!.getComputedTiming().duration as number) * (1 - transitionProgressRecord.progress);
};
