const getElementByViewTransitionTag = (tag: string, parent: Element | Document = document) => {
  const targets = parent.querySelectorAll(`[data-viewtransition*='tag":"${tag}"']`);

  if (targets.length > 1) {
    throw new Error(`Found more than one target for tag: ${tag}`);
  }

  return targets[0];
};

export default getElementByViewTransitionTag;
