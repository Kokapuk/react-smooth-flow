import { Keyframes, PropertyIndexedKeyframes } from './types';

const getInitialKeyframe = (keyframes: Keyframes) => {
  if (Array.isArray(keyframes)) {
    const initialKeyframe = keyframes.slice(0, 1);

    if (!initialKeyframe.length) {
      return [];
    }

    delete initialKeyframe[0].offset;

    return initialKeyframe;
  } else {
    const initialKeyframe = JSON.parse(JSON.stringify(keyframes)) as PropertyIndexedKeyframes;
    delete initialKeyframe.offset;

    Object.keys(initialKeyframe).forEach((key) => initialKeyframe[key]!.splice(1));

    return initialKeyframe;
  }
};

export default getInitialKeyframe;
