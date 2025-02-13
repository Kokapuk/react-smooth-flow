import getElementByTransitionTag from './getElementByTransitionTag';

const hideElementsWithTags = (tags: string[], targetElement: HTMLElement) => {
  tags.forEach((tag) => {
    const element = getElementByTransitionTag(tag, targetElement);

    if (!element) {
      return;
    }

    element.style.setProperty('opacity', '0', 'important');
    element.style.setProperty('transition', 'none', 'important');
  });
};

export default hideElementsWithTags;
