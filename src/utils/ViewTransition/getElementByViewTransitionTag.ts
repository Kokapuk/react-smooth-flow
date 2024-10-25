export default (tag: string, parent: Element | Document = document) =>
  parent.querySelector(`[data-viewtransition*='tag":"${tag}"']`);
