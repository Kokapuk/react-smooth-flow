const getTotalZIndex = (element: HTMLElement, upToElement: HTMLElement = document.body) => {
  let target: HTMLElement | null = element;
  let zIndex = 0;

  while (target && target !== upToElement) {
    const computedStyle = window.getComputedStyle(target);
    const parsedZIndex = parseInt(computedStyle.zIndex);

    if (!Number.isNaN(parsedZIndex)) {
      zIndex += parsedZIndex;
    }

    target = target.parentElement;
  }

  return zIndex;
};

export default getTotalZIndex;
