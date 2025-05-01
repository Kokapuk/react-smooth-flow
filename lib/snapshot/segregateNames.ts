import { Tag } from '../types';
import elementMatchesAnyTag from './elementMatchesAnyTag';

const segregateNames = (element: HTMLElement, excludeTags: Tag[]) => {
  const elements: HTMLInputElement[] = [];

  if (element.matches('[name]')) {
    elements.push(element as HTMLInputElement);
  }

  elements.push(...(element.querySelectorAll('[name]') as NodeListOf<HTMLInputElement>));

  const nameMap: Record<string, string> = {};

  elements.forEach((element) => {
    if (!element.name) {
      return;
    }

    if (elementMatchesAnyTag(element, excludeTags)) {
      return;
    }

    if (nameMap[element.name]) {
      element.name = nameMap[element.name];
    } else {
      const newName = `rsf-${Math.random().toString(16).split('.')[1]}`;

      nameMap[element.name] = newName;
      element.name = newName;
    }
  });
};

export default segregateNames;
