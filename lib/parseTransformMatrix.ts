import { TransformMatrix } from './types';

const parseTransformMatrix = (matrix: string) => {
  const [scaleX, skewY, skewX, scaleY, translateX, translateY] = matrix
    .replace('matrix(', '')
    .replace(')', '')
    .split(', ')
    .map((value) => parseInt(value));

  const parsedMatrix: TransformMatrix & { toString: () => string } = {
    scaleX,
    skewY,
    skewX,
    scaleY,
    translateX,
    translateY,
    toString: function () {
      return `matrix(${this.scaleX}, ${this.skewY}, ${this.skewX}, ${this.scaleY}, ${this.translateX}, ${this.translateY})`;
    },
  };

  return parsedMatrix;
};

export default parseTransformMatrix;
