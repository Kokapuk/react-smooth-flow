import getElementByViewTransitionTag from './getElementByViewTransitionTag';

export default (tags: string[], targetElement: HTMLElement, suppressHidingTags?: string[]) => {
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
