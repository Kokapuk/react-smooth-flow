import { DynamicState } from '../types';

const captureDynamicStates = (targetElement: HTMLElement, path?: number[]): DynamicState[] => {
  const dynamicState: DynamicState = {};

  if (targetElement.scrollTop) {
    dynamicState.scrollTop = targetElement.scrollTop;
  }

  if (targetElement.scrollLeft) {
    dynamicState.scrollLeft = targetElement.scrollLeft;
  }

  if (targetElement instanceof HTMLInputElement || targetElement instanceof HTMLTextAreaElement) {
    dynamicState.value = targetElement.value;
  }

  if (targetElement instanceof HTMLInputElement) {
    if (targetElement.checked) {
      dynamicState.checked = true;
    }
  }

  if (targetElement instanceof HTMLSelectElement) {
    dynamicState.selectedIndex = targetElement.selectedIndex;
  }

  const children = Array.from(targetElement.children) as HTMLElement[];

  const states = children.flatMap((child) => captureDynamicStates(child, [...(path ?? []), children.indexOf(child)]));

  if (Object.keys(dynamicState).length) {
    states.unshift({ path, ...dynamicState });
  }

  return states;
};

export default captureDynamicStates;
