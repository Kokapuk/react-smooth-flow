import { DynamicState } from '../types';

const captureDynamicStates = (element: HTMLElement, remainingDepth: number, path?: number[]): DynamicState[] => {
  if (remainingDepth === 0) {
    return [];
  }

  const dynamicState: DynamicState = {};

  if (element.scrollTop) {
    dynamicState.scrollTop = element.scrollTop;
  }

  if (element.scrollLeft) {
    dynamicState.scrollLeft = element.scrollLeft;
  }

  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    dynamicState.value = element.value;
  }

  if (element instanceof HTMLInputElement) {
    if (element.checked) {
      dynamicState.checked = true;
    }
  }

  if (element instanceof HTMLSelectElement) {
    dynamicState.selectedIndex = element.selectedIndex;
  }

  const children = Array.from(element.children) as HTMLElement[];

  const states = children.flatMap((child) =>
    captureDynamicStates(child, remainingDepth - 1, [...(path ?? []), children.indexOf(child)])
  );

  if (Object.keys(dynamicState).length) {
    states.unshift({ path, ...dynamicState });
  }

  return states;
};

export default captureDynamicStates;
