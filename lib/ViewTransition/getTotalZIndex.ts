const getTotalZIndex = (element: HTMLElement, upToElement: HTMLElement = document.body) => {
  let target: HTMLElement | null = element;
  let zIndex = 0;

  while (target && target !== upToElement) {
    const computedStyles = window.getComputedStyle(target);
    const parsedZIndex = parseInt(computedStyles.zIndex);

    if (!Number.isNaN(parsedZIndex)) {
      zIndex += parsedZIndex;
    }

    target = target.parentElement;
  }

  return zIndex;
};

export default getTotalZIndex;
