export default (element: HTMLElement) => {
  let target: HTMLElement | null = element;

  while (target && target !== document.body) {
    const computedStyles = window.getComputedStyle(target);

    if (computedStyles.position === 'fixed') {
      return true;
    }

    target = target.parentElement;
  }

  return false;
};
