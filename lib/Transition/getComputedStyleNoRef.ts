import detectBrowser from './detectBrowser';
import { ComputedStyle } from './types';

const getComputedStyleNoRef = (element: HTMLElement) => {
  const computedStyleWithRef = window.getComputedStyle(element);
  const detectedBrowser = detectBrowser();

  if (detectedBrowser === 'chromium') {
    return { ...computedStyleWithRef } as ComputedStyle;
  }

  const computedStyleParsed = JSON.parse(JSON.stringify(computedStyleWithRef));
  const properties = Object.values(computedStyleParsed) as string[];
  const computedStyle: { [key: string]: string } = {};

  properties.forEach(
    (i) => (computedStyle[i.replace(/-./g, (i) => i[1].toUpperCase())] = computedStyleWithRef.getPropertyValue(i))
  );

  return computedStyle as unknown as ComputedStyle;
};

export default getComputedStyleNoRef;
