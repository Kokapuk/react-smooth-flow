import getElementByViewTransitionTag from './getElementByViewTransitionTag';

const hideElementsWithTags = (
  tags: string[],
  targetElement: HTMLElement,
  suppressHidingTags?: string[],
) => {
  tags.forEach((tag) => {
    if (suppressHidingTags?.includes(tag)) {
      return;
    }

    const element = getElementByViewTransitionTag(tag, targetElement) as HTMLElement | null;

    if (!element) {
      return;
    }

    element.style.visibility = 'hidden';
  });
};

export default hideElementsWithTags;
