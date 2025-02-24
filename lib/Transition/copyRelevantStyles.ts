const copyRelevantStyles = (element: HTMLElement, elementClone: HTMLElement, image: HTMLElement) => {
  const matchedRules = [...document.styleSheets]
    .flatMap((sheet) => [...sheet.cssRules])
    .filter((rule) => {
      if (!(rule instanceof CSSStyleRule)) {
        return false;
      }

      return element.matches(rule.selectorText) || !!element.querySelector(rule.selectorText);
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
    let croppedSelector = selector;

    while (!elementClone.matches(croppedSelector) && !elementClone.querySelector(croppedSelector)) {
      const splitterIndex = croppedSelector.search(/\s>\s|\s\+\s|\s~\s|\s/);

      if (splitterIndex === -1) {
        console.warn(
          'Encountered invalid selector, styles will not be captured accurately, possible visual issues. Check styles on',
          element,
          'List of currently unsupported selectors: https://github.com/Kokapuk/react-smooth-flow/blob/main/README.md'
        );
        break;
      }

      croppedSelector = croppedSelector.substring(splitterIndex + 1);
    }

    selectorIndexedStyles[`.rsf-image > .rsf-snapshotContainer > ${croppedSelector}`] = selectorIndexedStyles[selector];
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
