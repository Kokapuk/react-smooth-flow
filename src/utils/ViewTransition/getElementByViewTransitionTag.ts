const getElementByViewTransitionTag = (tag: string) => document.querySelector(`[data-viewtransition*='tag":"${tag}"']`);

export default getElementByViewTransitionTag;
