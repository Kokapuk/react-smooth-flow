const elementHasFixedPosition = (element: HTMLElement) => {
  let target: HTMLElement | null = element;

  while (target && target !== document.body) {
    const computedStyle = window.getComputedStyle(target);

    if (computedStyle.position === 'fixed') {
      return true;
    }

    target = target.parentElement;
  }

  return false;
};

export default elementHasFixedPosition;
