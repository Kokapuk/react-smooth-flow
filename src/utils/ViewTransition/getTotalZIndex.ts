const getTotalZIndex = (element: HTMLElement) => {
  let target = element;
  let zIndex = 0;

  while (target.parentElement && target.parentElement !== document.body) {
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
