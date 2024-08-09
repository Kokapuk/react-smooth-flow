const getContainingBlock = (element: HTMLElement) => {
  if (!element.parentElement) {
    return null;
  }

  const computedStyles = window.getComputedStyle(element.parentElement);

  if (
    [computedStyles.filter, computedStyles.backdropFilter, computedStyles.transform, computedStyles.perspective].some(
      (i) => i !== 'none'
    )
  ) {
    return element.parentElement;
  }

  if (['layout', 'paint', 'strict', 'content'].includes(computedStyles.contain)) {
    return element.parentElement;
  }

  if (computedStyles.containerType !== 'normal') {
    return element.parentElement;
  }

  if (
    ['filter', 'backdrop-filter', 'transform', 'perspective', 'contain'].some((i) =>
      computedStyles.willChange.includes(i)
    )
  ) {
    return element.parentElement;
  }

  if (computedStyles.contentVisibility === 'auto') {
    return element.parentElement;
  }

  return getContainingBlock(element.parentElement);
};

export default getContainingBlock;
