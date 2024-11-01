import getElementByViewTransitionTag from './getElementByViewTransitionTag';

const hideElementsWithTags = (tags: string[], targetElement: HTMLElement, suppressHidingTags?: string[]) => {
  tags.forEach((tag) => {
    if (suppressHidingTags?.includes(tag)) {
      return;
    }

    const element = getElementByViewTransitionTag(tag, targetElement) as HTMLElement | null;

    if (!element) {
      return;
    }

    element.style.opacity = '0';
    element.style.transition = 'none';
  });
};

export default hideElementsWithTags;
