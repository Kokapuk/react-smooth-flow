const copyRelevantStyles = (element: HTMLElement, image: HTMLElement) => {
  const matchedRules = [...document.styleSheets]
    .flatMap((sheet) => [...sheet.cssRules])
    .filter((rule) => {
      if (!(rule instanceof CSSStyleRule)) {
        return false;
      }

      return element.matches(rule.selectorText);
    })
    .map((rule) => rule.cssText);

  const selectorIndexedStyles: Record<string, string> = {};

  matchedRules.forEach((i) => {
    const selector = i.replace(/\s{.+}/, '');
    const styles = i.match(/({.+})/)![0];
    const uncombinedSelectors = selector.split(', ');

    uncombinedSelectors.forEach((i) => (selectorIndexedStyles[i] = styles));
  });

  Object.keys(selectorIndexedStyles).forEach((selector) => {
    const splittedSelector = selector.split(/\s>\s|\s\+\s|\s~\s|\s/);
    selectorIndexedStyles[`.rsf-image ${splittedSelector.pop()!}`] = selectorIndexedStyles[selector];
    delete selectorIndexedStyles[selector];
  });

  const styles = Object.keys(selectorIndexedStyles)
    .map((selector) => `${selector} ${selectorIndexedStyles[selector]}`)
    .join(' ');

  if (Object.keys(selectorIndexedStyles).length) {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = styles;
    image.prepend(styleTag);
  }
};

export default copyRelevantStyles;
