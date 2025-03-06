import elementMatchesAnyTag from './elementMatchesAnyTag';
import { Tag } from './types';

const segregateIds = (targetElement: HTMLElement, excludeTags: Tag[]) => {
  const elements: HTMLElement[] = [];

  if (targetElement.matches('[id]')) {
    elements.push(targetElement);
  }

  elements.push(...(Array.from(targetElement.querySelectorAll('[id]')) as HTMLElement[]));

  const idMap: Record<string, string> = {};

  elements.forEach((element) => {
    if (!element.id) {
      return;
    }

    if (elementMatchesAnyTag(element, excludeTags)) {
      return;
    }

    const newId = `rsf-${Math.random().toString(16).split('.')[1]}`;

    idMap[element.id] = newId;
    element.id = newId;
  });

  Array.from(targetElement.querySelectorAll('[clip-path^="url(#"]')).forEach((element) => {
    const id = element.getAttribute('clip-path')?.match(/url\(#(.+)\)/)?.[1];

    if (!id) {
      return;
    }

    element.setAttribute('clip-path', `url(#${idMap[id]})`);
  });

  Array.from(targetElement.querySelectorAll('[mask^="url(#"]')).forEach((element) => {
    const id = element.getAttribute('mask')?.match(/url\(#(.+)\)/)?.[1];

    if (!id) {
      return;
    }

    element.setAttribute('mask', `url(#${idMap[id]})`);
  });

  Array.from(targetElement.querySelectorAll('use[href^="#"]')).forEach((element) => {
    const id = element.getAttribute('href')?.replace('#', '');

    if (!id) {
      return;
    }

    element.setAttribute('href', `#${idMap[id]}`);
  });
};

export default segregateIds;
