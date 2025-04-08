import adjustBoundsToRoot from './adjustBoundsToRoot';
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
  const transitionOptions = transitionMapping[targetTag];
  const transitionRoot = transitionOptions.transitionRootTag
    ? getElementByTransitionRootTag(transitionOptions.transitionRootTag)
    : null;

  if (transitionOptions.transitionRootTag && !transitionRoot) {
    throw Error(`Failed to find transition root with tag "${transitionOptions.transitionRootTag}"`);
  }

  const computedStyle = getComputedStyleNoRef(targetElement);
  computedStyle.opacity = `${getTotalOpacity(targetElement, transitionRoot ?? undefined)}`;

  const bounds = getElementBounds(targetElement);
  const hasFixedPosition = elementHasFixedPosition(targetElement);
  
  if (transitionRoot) {
    adjustBoundsToRoot(bounds, transitionRoot);
  }

  const targetElementClone = targetElement.cloneNode(true) as HTMLElement;

  if (transitionOptions.relevantStyleProperties.length) {
    copyRelevantStyles(targetElement, targetElementClone, transitionOptions.relevantStyleProperties);
  }

  hideElementsWithTags(excludeTags, targetElementClone);
  segregateIds(targetElementClone, excludeTags);

  targetElementClone.style.setProperty('background-color', 'transparent', 'important');
  targetElementClone.style.setProperty('border-radius', '0', 'important');
  targetElementClone.style.setProperty('border-width', '0', 'important');
  targetElementClone.style.setProperty('position', 'static', 'important');
  targetElementClone.style.setProperty('margin', '0', 'important');
  targetElementClone.style.setProperty('opacity', '1', 'important');
  targetElementClone.style.setProperty('box-shadow', 'none', 'important');
  targetElementClone.style.setProperty('backdrop-filter', 'none', 'important');

  const snapshotContainer = document.createElement('div');
  snapshotContainer.inert = true;
  snapshotContainer.classList.add('rsf-snapshotContainer', `rsf-${transitionOptions.contentAlign}`);
  snapshotContainer.style.setProperty('--borderTopWidth', computedStyle.borderTopWidth);
  snapshotContainer.style.setProperty('--borderRightWidth', computedStyle.borderRightWidth);
  snapshotContainer.style.setProperty('--borderBottomWidth', computedStyle.borderBottomWidth);
  snapshotContainer.style.setProperty('--borderLeftWidth', computedStyle.borderLeftWidth);

  const transformContainer = document.createElement('div');
  transformContainer.className = 'rsf-transformContainer';
  transformContainer.style.width = `${bounds.width}px`;
  transformContainer.style.height = `${bounds.height}px`;

  transformContainer.innerHTML = targetElementClone.outerHTML
    .replace(/\sdata-transition=".+?"/gm, '')
    .replace(/\sdata-transitionroot=".+?"/gm, '');

  snapshotContainer.append(transformContainer);

  return {
    tag: targetTag,
    bounds,
    image: snapshotContainer,
    computedStyle,
    transitionOptions,
    transitionMapping,
    hasFixedPosition,
    transitionRoot,
    targetElement,
    totalZIndex: getTotalZIndex(targetElement, transitionRoot ?? undefined),
  };
};

export default captureSnapshot;
