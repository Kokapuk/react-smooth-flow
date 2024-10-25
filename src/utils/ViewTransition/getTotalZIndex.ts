export default (element: HTMLElement) => {
  let target: HTMLElement | null = element;
  let zIndex = 0;

  while (target && target !== document.body) {
    const computedStyles = window.getComputedStyle(target);
    const parsedZIndex = parseInt(computedStyles.zIndex);

    if (!Number.isNaN(parsedZIndex)) {
      zIndex += parsedZIndex;
    }

    target = target.parentElement;
  }

  return zIndex;
};
