export default (element: Element, tags: string[]) => {
  for (const tag in tags) {
    if (element.matches(`[data-viewtransition*='tag":"${tag}"']`)) {
      return true;
    }
  }

  return false;
};
