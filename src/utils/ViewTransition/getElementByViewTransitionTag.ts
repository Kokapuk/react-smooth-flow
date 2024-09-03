const getElementByViewTransitionTag = (tag: string, parent: Element | Document = document) =>
  parent.querySelector(`[data-viewtransition*='tag":"${tag}"']`);

export default getElementByViewTransitionTag;
