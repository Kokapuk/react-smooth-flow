import elementMatchesAnyTag from './elementMatchesAnyTag';

const unifyIds = (targetElement: Element, excludeTags: string[]) => {
  const elements: Element[] = [];

  if (targetElement.matches('[id]')) {
    elements.push(targetElement);
  }

  elements.push(...Array.from(targetElement.querySelectorAll('[id]')));

  const idMap: { [key: string]: string } = {};

  elements.forEach((i) => {
    if (!i.id) {
      return;
    }

    if (elementMatchesAnyTag(i, excludeTags)) {
      return;
    }

    const newId = `vt-${Math.random().toString(16).split('.')[1]}`;

    idMap[i.id] = newId;
    i.id = newId;
  });

  Array.from(targetElement.querySelectorAll('[clip-path^="url(#"]')).forEach((i) => {
    const id = i.getAttribute('clip-path')?.match(/url\(#(.+)\)/)?.[1];

    if (!id) {
      return;
    }

    i.setAttribute('clip-path', `url(#${idMap[id]})`);
  });

  Array.from(targetElement.querySelectorAll('[mask^="url(#"]')).forEach((i) => {
    const id = i.getAttribute('mask')?.match(/url\(#(.+)\)/)?.[1];

    if (!id) {
      return;
    }

    i.setAttribute('mask', `url(#${idMap[id]})`);
  });

  Array.from(targetElement.querySelectorAll('use[href^="#"]')).forEach((i) => {
    const id = i.getAttribute('href')?.replace('#', '');

    if (!id) {
      return;
    }

    i.setAttribute('href', `#${idMap[id]}`);
  });
};

export default unifyIds;