import { Keyframes } from './types';

const getReversedKeyframes = (keyframes: Keyframes) => {
  if (Array.isArray(keyframes)) {
    const reversedKeyframes = [...keyframes].reverse();
    reversedKeyframes.forEach((i) => (i.offset = i.offset === undefined ? undefined : 1 - i.offset));

    return reversedKeyframes;
  } else {
    const reversedKeyframes = keyframes;
    Object.keys(reversedKeyframes).forEach((key) => reversedKeyframes[key]!.reverse());
    reversedKeyframes.offset = reversedKeyframes.offset?.map((i) => 1 - i);

    return reversedKeyframes;
  }
};

export default getReversedKeyframes;
