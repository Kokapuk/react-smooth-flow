import { RelevantStyleProperties } from './types';

const copyRelevantStyles = (
  captureTarget: HTMLElement,
  transferTarget: HTMLElement,
  properties: RelevantStyleProperties
) => {
  const computedStyle = getComputedStyle(captureTarget);

  properties.forEach((property) => {
    transferTarget.style.setProperty(property, computedStyle.getPropertyValue(property), 'important');
  });

  const captureChildren = Array.from(captureTarget.children) as HTMLElement[];
  const transferChildren = Array.from(transferTarget.children) as HTMLElement[];

  for (let i = 0; i < captureChildren.length; i++) {
    copyRelevantStyles(captureChildren[i], transferChildren[i], properties);
  }
};

export default copyRelevantStyles;
