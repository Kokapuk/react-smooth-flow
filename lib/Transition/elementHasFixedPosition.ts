import getComputedStyleNoRef from './getComputedStyleNoRef';

const elementHasFixedPosition = (element: HTMLElement) => {
  let target: HTMLElement | null = element;

  while (target && target !== document.body) {
    const computedStyles = getComputedStyleNoRef(target);

    if (computedStyles.position === 'fixed') {
      return true;
    }

    target = target.parentElement;
  }

  return false;
};

export default elementHasFixedPosition;
