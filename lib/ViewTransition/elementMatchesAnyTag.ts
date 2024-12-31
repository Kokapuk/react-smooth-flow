const elementMatchesAnyTag = (element: Element, tags: string[]) => {
  for (const tag of tags) {
    if (element.matches(`[data-viewtransition*='tag":"${tag}"']`)) {
      return true;
    }
  }

  return false;
};

export default elementMatchesAnyTag;
