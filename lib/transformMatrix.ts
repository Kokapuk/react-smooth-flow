export interface TransformOptions {
  scaleX: number;
  skewY: number;
  skewX: number;
  scaleY: number;
  translateX: number;
  translateY: number;
}

class TransformMatrix {
  scaleX: number;
  skewY: number;
  skewX: number;
  scaleY: number;
  translateX: number;
  translateY: number;

  constructor();
  constructor(matrix: string);
  constructor(transformOptions: Partial<TransformOptions>);
  constructor(a?: string | Partial<TransformMatrix>) {
    if (typeof a === 'string' && a !== 'none') {
      const [scaleX, skewY, skewX, scaleY, translateX, translateY] = a
        .replace('matrix(', '')
        .replace(')', '')
        .split(', ')
        .map((value) => parseFloat(value));

      this.scaleX = scaleX;
      this.skewY = skewY;
      this.skewX = skewX;
      this.scaleY = scaleY;
      this.translateX = translateX;
      this.translateY = translateY;
    } else if (a === 'none') {
      this.scaleX = 1;
      this.skewY = 0;
      this.skewX = 0;
      this.scaleY = 1;
      this.translateX = 0;
      this.translateY = 0;
    } else {
      this.scaleX = a?.scaleX ?? 1;
      this.skewY = a?.skewY ?? 0;
      this.skewX = a?.skewX ?? 0;
      this.scaleY = a?.scaleY ?? 1;
      this.translateX = a?.translateX ?? 0;
      this.translateY = a?.translateY ?? 0;
    }
  }

  get options() {
    return {
      scaleX: this.scaleX,
      skewY: this.skewY,
      skewX: this.skewX,
      scaleY: this.scaleY,
      translateX: this.translateX,
      translateY: this.translateY,
    } as Readonly<TransformOptions>;
  }

  toString() {
    return `matrix(${this.scaleX}, ${this.skewY}, ${this.skewX}, ${this.scaleY}, ${this.translateX}, ${this.translateY})`;
  }
}

export default TransformMatrix;
