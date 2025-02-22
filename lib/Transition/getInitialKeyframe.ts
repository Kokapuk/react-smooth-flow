import { Keyframes, PropertyIndexedKeyframes } from './types';

const getInitialKeyframe = (keyframes: Keyframes) => {
  if (Array.isArray(keyframes)) {
    const initialKeyframe = keyframes.slice(0, 1);
    delete initialKeyframe[0].offset;

    return initialKeyframe;
  } else {
    const initialKeyframe = JSON.parse(JSON.stringify(keyframes)) as PropertyIndexedKeyframes;
    delete initialKeyframe.offset;

    Object.keys(initialKeyframe).forEach((key) => (initialKeyframe[key] = initialKeyframe[key]!.slice(0, 1)));

    return initialKeyframe;
  }
};

export default getInitialKeyframe;
