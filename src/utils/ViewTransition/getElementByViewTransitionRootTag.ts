const getElementByViewTransitionRootTag = (tag: string, parent: Element | Document = document) =>
  parent.querySelector(`[data-viewtransitionroot='${tag}']`);

export default getElementByViewTransitionRootTag;
