import { Keyframes, PropertyIndexedKeyframes } from './types';

const getReversedKeyframes = (keyframes: Keyframes) => {
  if (Array.isArray(keyframes)) {
    const reversedKeyframes = [...keyframes].reverse();
    reversedKeyframes.forEach(
      (keyframe) => (keyframe.offset = keyframe.offset === undefined ? undefined : 1 - keyframe.offset)
    );

    return reversedKeyframes;
  } else {
    const reversedKeyframes = JSON.parse(JSON.stringify(keyframes)) as PropertyIndexedKeyframes;
    Object.keys(reversedKeyframes).forEach((property) => reversedKeyframes[property]!.reverse());
    reversedKeyframes.offset = reversedKeyframes.offset?.map((offset) => 1 - offset);

    return reversedKeyframes;
  }
};

export default getReversedKeyframes;
