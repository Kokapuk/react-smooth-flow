import adjustBoundsToRoot from './adjustBoundsToRoot';
import captureDynamicStateData from './captureDynamicStateData';
import copyRelevantStyles from './copyRelevantStyles';
import elementHasFixedPosition from './elementHasFixedPosition';
import getComputedStyleNoRef from './getComputedStyleNoRef';
import getElementBounds from './getElementBounds';
import getTotalOpacity from './getTotalOpacity';
import getTotalZIndex from './getTotalZIndex';
import hideElementsWithTags from './hideElementsWithTags';
import { getRoot, getTransitionMapping } from './registry/store';
import segregateIds from './segregateIds';
import { Snapshot, Tag } from './types';

const captureSnapshot = (targetElement: HTMLElement | null, targetTag: Tag, excludeTags: Tag[]): Snapshot | null => {
  if (!targetElement) {
    return null;
  }

  const transitionMapping = getTransitionMapping(targetElement)!;
  const transitionOptions = transitionMapping[targetTag];
  const root = transitionOptions.root ? getRoot(transitionOptions.root) : null;

  if (transitionOptions.root && !root) {
    throw Error(`Failed to find root with tag "${transitionOptions.root}"`);
  }

  const computedStyle = getComputedStyleNoRef(targetElement);
  computedStyle.opacity = `${getTotalOpacity(targetElement, root ?? undefined)}`;

  const bounds = getElementBounds(targetElement);

  if (root) {
    adjustBoundsToRoot(bounds, root);
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

  const snapshotContainer = document.createElement('rsf-snapshot-container');
  snapshotContainer.inert = true;
  snapshotContainer.className = `rsf-${transitionOptions.contentAlign}`;
  snapshotContainer.style.setProperty('--borderTopWidth', computedStyle.borderTopWidth);
  snapshotContainer.style.setProperty('--borderRightWidth', computedStyle.borderRightWidth);
  snapshotContainer.style.setProperty('--borderBottomWidth', computedStyle.borderBottomWidth);
  snapshotContainer.style.setProperty('--borderLeftWidth', computedStyle.borderLeftWidth);

  const transformContainer = document.createElement('rsf-transform-container');
  transformContainer.style.width = `${bounds.width}px`;
  transformContainer.style.height = `${bounds.height}px`;

  transformContainer.innerHTML = targetElementClone.outerHTML
    .replace(/\sdata-transitioned=".+?"/gm, '')
    .replace(/\sdata-root=".+?"/gm, '');

  snapshotContainer.append(transformContainer);

  return {
    tag: targetTag,
    bounds,
    image: snapshotContainer,
    computedStyle,
    transitionOptions,
    transitionMapping,
    hasFixedPosition: elementHasFixedPosition(targetElement),
    root: root,
    targetElement,
    targetElementClone: snapshotContainer.children[0].children[0] as HTMLElement,
    targetDOMPosition: {
      parentElement: targetElement.parentElement!,
      index: Array.from(targetElement.parentElement!.children).indexOf(targetElement),
    },
    totalZIndex: getTotalZIndex(targetElement, root ?? undefined),
    dynamicStateData: captureDynamicStateData(targetElement),
  };
};

export default captureSnapshot;
