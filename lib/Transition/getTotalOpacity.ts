const getTotalOpacity = (element: HTMLElement) => {
  let target: HTMLElement | null = element;
  let opacity = 1;

  while (target && target !== document.body) {
    const computedStyles = window.getComputedStyle(target);
    const parsedOpacity = parseFloat(computedStyles.opacity);

    if (!Number.isNaN(parsedOpacity)) {
      opacity *= parsedOpacity;
    }

    target = target.parentElement;
  }

  return opacity;
};

export default getTotalOpacity;
