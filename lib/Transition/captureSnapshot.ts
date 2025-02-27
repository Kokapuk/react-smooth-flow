import { STYLE_PROPERTIES_TO_CAPTURE } from './config';
import copyRelevantStyles from './copyRelevantStyles';
import elementHasFixedPosition from './elementHasFixedPosition';
import getComputedStyleNoRef from './getComputedStyleNoRef';
import getElementBounds from './getElementBounds';
import getElementByTransitionRootTag from './getElementByTransitionRootTag';
import getElementTransitionMapping from './getElementTransitionMapping';
import getTotalOpacity from './getTotalOpacity';
import getTotalZIndex from './getTotalZIndex';
import hideElementsWithTags from './hideElementsWithTags';
import segregateIds from './segregateIds';
import { Snapshot } from './types';

const captureSnapshot = (
  targetElement: HTMLElement | null,
  targetTag: string,
  excludeTags: string[]
): Snapshot | null => {
  if (!targetElement) {
    return null;
  }

  const transitionMapping = getElementTransitionMapping(targetElement)!;

  const computedStyle = getComputedStyleNoRef(targetElement);
  computedStyle.opacity = `${getTotalOpacity(targetElement)}`;

  const bounds = getElementBounds(targetElement);
  const hasFixedPosition = elementHasFixedPosition(targetElement);
  const transitionProperties = transitionMapping[targetTag];

  const transitionRoot = transitionProperties.transitionRootTag
    ? getElementByTransitionRootTag(transitionProperties.transitionRootTag)
    : null;

  if (transitionProperties.transitionRootTag && !transitionRoot) {
    throw Error(`Failed to find transition root with tag "${transitionProperties.transitionRootTag}"`);
  }

  const transitionRootBounds = transitionRoot ? getElementBounds(transitionRoot) : null;

  if (transitionRootBounds) {
    bounds.top -= transitionRootBounds.top - transitionRoot!.scrollTop;
    bounds.right -= transitionRootBounds.right + transitionRootBounds.scrollBarWidth + transitionRoot!.scrollLeft;
    bounds.left -= transitionRootBounds.left - transitionRoot!.scrollLeft;
    bounds.bottom -= transitionRootBounds.bottom + transitionRootBounds.scrollBarHeight + transitionRoot!.scrollTop;
  }

  const targetElementClone = targetElement.cloneNode(true) as HTMLElement;

  if (transitionProperties.relevantStyleProperties.length) {
    copyRelevantStyles(targetElement, targetElementClone, transitionProperties.relevantStyleProperties);
  }

  hideElementsWithTags(excludeTags, targetElementClone);
  segregateIds(targetElementClone, excludeTags);

  targetElementClone.style.setProperty('background-color', 'transparent', 'important');
  targetElementClone.style.setProperty('border-radius', '0', 'important');
  targetElementClone.style.setProperty('border-width', '0', 'important');
  targetElementClone.style.setProperty('position', 'static', 'important');
  targetElementClone.style.setProperty('margin', '0', 'important');
  targetElementClone.style.setProperty('opacity', '1', 'important');
  targetElementClone.style.setProperty('pointer-events', 'none', 'important');
  targetElementClone.style.setProperty('box-shadow', 'none', 'important');
  targetElementClone.style.setProperty('backdrop-filter', 'none', 'important');

  const image = document.createElement('div');
  image.className = 'rsf-image';
  image.style.overflow = transitionProperties.overflow;
  image.style.zIndex = `${getTotalZIndex(targetElement, transitionRoot ?? undefined)}`;
  image.style.width = `${bounds.width}px`;
  image.style.height = `${bounds.height}px`;

  // @ts-ignore
  STYLE_PROPERTIES_TO_CAPTURE.forEach((property) => (image.style[property] = computedStyle[property]));

  const snapshotContainerStyles = Object.entries({
    width: `${bounds.width}px`,
    height: `${bounds.height}px`,
    '--borderTopWidth': computedStyle.borderTopWidth,
    '--borderRightWidth': computedStyle.borderRightWidth,
    '--borderBottomWidth': computedStyle.borderBottomWidth,
    '--borderLeftWidth': computedStyle.borderLeftWidth,
    padding: `${computedStyle.borderTopWidth} ${computedStyle.borderRightWidth} ${computedStyle.borderBottomWidth} ${computedStyle.borderLeftWidth}`,
  })
    .filter(([_, value]) => Boolean(value))
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ');

  const snapshotContainerClasses = ['rsf-snapshotContainer', `rsf-${transitionProperties.contentAlign}`].join(' ');

  image.innerHTML = `
    <div class="${snapshotContainerClasses}" style="${snapshotContainerStyles}">
      ${targetElementClone.outerHTML
        .replace(/\sdata-transition=".+?"/gm, '')
        .replace(/\sdata-transitionroot=".+?"/gm, '')}
    </div>`;

  return {
    tag: targetTag,
    bounds,
    image,
    computedStyle,
    transitionProperties,
    hasFixedPosition,
    transitionRoot,
    targetElement,
  };
};

export default captureSnapshot;
