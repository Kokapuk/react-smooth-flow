const getElementByTransitionRootTag = (tag: string, parent: Element | Document = document) => {
  const matchedElements = parent.querySelectorAll(`[data-transitionroot='${tag}']`);

  if (!matchedElements.length) {
    return null;
  } else if (matchedElements.length > 1) {
    throw Error(
      `Transition root tag must be unique. Found ${matchedElements.length} elements with the "${tag}" root tag.`
    );
  } else {
    return matchedElements[0] as HTMLElement;
  }
};

export default getElementByTransitionRootTag;
