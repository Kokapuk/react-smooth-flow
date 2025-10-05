import camelCaseToKebabCase from './camelCaseToKebabCase';
import { Keyframes } from './types';

function fillOffsetGaps(offsets: (number | null)[]): asserts offsets is number[] {
  if (offsets[0] === null) {
    offsets[0] = 0;
  }

  if (offsets[offsets.length - 1] === null) {
    offsets[offsets.length - 1] = 1;
  }

  const emptySpaces: { startIndex: number; endIndex: number }[] = [];

  let currentEmptySpaceStart: number | null = null;

  offsets.forEach((offset, index) => {
    if (offset === null && currentEmptySpaceStart === null) {
      currentEmptySpaceStart = index - 1;
    } else if (offset !== null && currentEmptySpaceStart !== null) {
      emptySpaces.push({ startIndex: currentEmptySpaceStart, endIndex: index });
      currentEmptySpaceStart = null;
    }
  });

  emptySpaces.forEach((emptySpace) => {
    const startNumber = offsets[emptySpace.startIndex]!;
    const endNumber = offsets[emptySpace.endIndex]!;
    const step = (endNumber - startNumber) / (emptySpace.endIndex - emptySpace.startIndex);

    for (let i = emptySpace.startIndex + 1; i < emptySpace.endIndex; i++) {
      const normalizedIndex = i - emptySpace.startIndex;
      offsets[i] = parseFloat((startNumber + normalizedIndex * step).toFixed(5));
    }
  });
}

const getCssKeyframes = (keyframes: Keyframes) => {
  const offsetIndexedKeyframes: Record<string, string> = {};

  if (Array.isArray(keyframes)) {
    const offsets: (number | null)[] = [];

    keyframes.forEach((keyframe, index) => {
      offsets[index] = keyframe.offset ?? null;
    });

    fillOffsetGaps(offsets);

    keyframes.forEach((keyframe, index) => {
      const rules = Object.entries(keyframe)
        .filter(([property]) => property !== 'offset')
        .map(([property, value]) => `${camelCaseToKebabCase(property)}:${value}`);

      offsetIndexedKeyframes[`${offsets[index] * 100}%`] = `${rules.join(';')};`;
    });
  } else {
    Object.entries(keyframes).forEach(([property, values]) => {
      if (!values) {
        return;
      }

      let offsets: number[] = [];

      if (keyframes.offset) {
        offsets = keyframes.offset;
      } else {
        const propertyIndexedOffsets = Array.from({ length: values.length }).fill(null) as null[];
        fillOffsetGaps(propertyIndexedOffsets);
        offsets = propertyIndexedOffsets;
      }

      values.forEach((value, index) => {
        const offsetPercent = `${offsets[index] * 100}%`;

        if (typeof offsetIndexedKeyframes[offsetPercent] !== 'string') {
          offsetIndexedKeyframes[offsetPercent] = '';
        }

        offsetIndexedKeyframes[offsetPercent] += `${camelCaseToKebabCase(property)}:${value};`;
      });
    });
  }

  const cssKeyframes = Object.entries(offsetIndexedKeyframes).map(([offset, rules]) => `${offset}{${rules}}`).join('');

  return cssKeyframes;
};

export default getCssKeyframes;
