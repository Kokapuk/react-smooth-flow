import getElementByViewTransitionTag from './getElementByViewTransitionTag';

const hideElementsWithTags = (tags: string[], targetElement: HTMLElement) => {
  tags.forEach((tag) => {
    const element = getElementByViewTransitionTag(tag, targetElement) as HTMLElement | null;

    if (!element) {
      return;
    }

    element.style.setProperty('opacity', '0', 'important');
    element.style.setProperty('transition', 'none', 'important');
  });
};

export default hideElementsWithTags;
