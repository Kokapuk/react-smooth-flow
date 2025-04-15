import elementMatchesAnyTag from './elementMatchesAnyTag';
import { Tag } from './types';

const segregateIds = (targetElement: HTMLElement, excludeTags: Tag[]) => {
  const elements: HTMLElement[] = [];

  if (targetElement.matches('[id]')) {
    elements.push(targetElement);
  }

  elements.push(...(targetElement.querySelectorAll('[id]') as NodeListOf<HTMLElement>));

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

  const idUrlAttributes = ['clip-path', 'mask', 'fill', 'stroke'];

  idUrlAttributes.forEach((attr) => {
    targetElement.querySelectorAll(`[${attr}^="url(#"]`).forEach((element) => {
      const id = element.getAttribute(attr)?.match(/url\(#(.+)\)/)?.[1];

      if (!id) {
        return;
      }

      element.setAttribute(attr, `url(#${idMap[id]})`);
    });
  });

  targetElement.querySelectorAll('use[href^="#"]').forEach((element) => {
    const id = element.getAttribute('href')?.replace('#', '');

    if (!id) {
      return;
    }

    element.setAttribute('href', `#${idMap[id]}`);
  });
};

export default segregateIds;
