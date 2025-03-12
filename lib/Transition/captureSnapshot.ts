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
import { Snapshot, Tag } from './types';

const captureSnapshot = (targetElement: HTMLElement | null, targetTag: Tag, excludeTags: Tag[]): Snapshot | null => {
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
  image.classList.add('rsf-snapshotContainer', `rsf-${transitionProperties.contentAlign}`);
  image.style.width = `${bounds.width}px`;
  image.style.height = `${bounds.height}px`;
  image.style.padding = `${computedStyle.borderTopWidth} ${computedStyle.borderRightWidth} ${computedStyle.borderBottomWidth} ${computedStyle.borderLeftWidth}`;
  image.style.setProperty('--borderTopWidth', computedStyle.borderTopWidth);
  image.style.setProperty('--borderRightWidth', computedStyle.borderRightWidth);
  image.style.setProperty('--borderBottomWidth', computedStyle.borderBottomWidth);
  image.style.setProperty('--borderLeftWidth', computedStyle.borderLeftWidth);

  image.innerHTML = targetElementClone.outerHTML
    .replace(/\sdata-transition=".+?"/gm, '')
    .replace(/\sdata-transitionroot=".+?"/gm, '');

  return {
    tag: targetTag,
    bounds,
    image,
    computedStyle,
    transitionProperties,
    hasFixedPosition,
    transitionRoot,
    targetElement,
    totalZIndex: getTotalZIndex(targetElement, transitionRoot ?? undefined),
  };
};

export default captureSnapshot;
