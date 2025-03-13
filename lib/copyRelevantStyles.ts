import { RelevantStyleProperties } from './types';

const copyRelevantStyles = (
  captureTarget: HTMLElement,
  transferTarget: HTMLElement,
  properties: RelevantStyleProperties
) => {
  const computedStyle = window.getComputedStyle(captureTarget);

  properties.forEach((property) => {
    transferTarget.style.setProperty(property, computedStyle.getPropertyValue(property), 'important');
  });

  const captureChildren = captureTarget.children;
  const transferChildren = transferTarget.children;

  for (let i = 0; i < captureChildren.length; i++) {
    copyRelevantStyles(captureChildren[i] as HTMLElement, transferChildren[i] as HTMLElement, properties);
  }
};

export default copyRelevantStyles;
