import { Properties } from 'csstype';
import { Keyframe, Keyframes, PropertyIndexedKeyframes } from '../types';

const extractPropertyKeyframes = (
  keyframes: Keyframes,
  property: keyof Properties
): { propertyKeyframes: Keyframes; restKeyframes: Keyframes } => {
  if (Array.isArray(keyframes)) {
    const keyframesClone = JSON.parse(JSON.stringify(keyframes)) as Keyframe[];

    const propertyKeyframes = keyframesClone
      .map((keyframe) => ({ [property]: keyframe[property], offset: keyframe.offset }))
      .filter((keyframe) => !!keyframe[property]);

    keyframesClone.forEach((keyframe) => delete keyframe[property]);

    return { propertyKeyframes, restKeyframes: keyframesClone };
  } else {
    const keyframesClone = JSON.parse(JSON.stringify(keyframes)) as PropertyIndexedKeyframes;

    const propertyKeyframes: PropertyIndexedKeyframes = { [property]: keyframesClone[property] };
    delete keyframesClone[property];

    return { propertyKeyframes, restKeyframes: keyframesClone };
  }
};

export default extractPropertyKeyframes;
