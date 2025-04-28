import { STYLE_PROPERTIES_TO_RESET_ON_IMAGE } from '@lib/defaults';
import { getRoot, getTransitionMapping } from '../registry/store';
import { Tag } from '../types';
import adjustBoundsToRoot from './adjustBoundsToRoot';
import captureDynamicStates from './captureDynamicStates';
import copyRelevantStyles from './copyRelevantStyles';
import elementDisableMotion from './elementDisableMotion';
import elementHasFixedPosition from './elementHasFixedPosition';
import getComputedStyleNoRef from './getComputedStyleNoRef';
import getElementBounds from './getElementBounds';
import getTotalOpacity from './getTotalOpacity';
import getTotalZIndex from './getTotalZIndex';
import hideElementWithTag from './hideElementsWithTags';
import segregateIds from './segregateIds';
import segregateNames from './segregateNames';

const captureSnapshot = (element: HTMLElement, targetTag: Tag, excludeTags: Tag[]) => {
  const resetElementMotion = elementDisableMotion(element);

  const transitionMapping = getTransitionMapping(element)!;
  const transitionOptions = transitionMapping[targetTag];
  const root = transitionOptions.root ? getRoot(transitionOptions.root) : null;

  if (transitionOptions.root && !root) {
    throw Error(`Failed to find root with tag "${transitionOptions.root}"`);
  }

  const computedStyle = getComputedStyleNoRef(element);
  computedStyle.opacity = `${getTotalOpacity(element, root ?? undefined)}`;

  const bounds = getElementBounds(element, transitionOptions.captureTransform);

  if (root) {
    adjustBoundsToRoot(bounds, root);
  }

  const targetElementClone = element.cloneNode(true) as HTMLElement;

  if (transitionOptions.relevantStyleProperties.length) {
    copyRelevantStyles(element, targetElementClone, transitionOptions.relevantStyleProperties);
  }

  resetElementMotion();

  excludeTags.forEach((tag) => hideElementWithTag(tag, targetElementClone));
  segregateIds(targetElementClone, excludeTags);
  segregateNames(targetElementClone, excludeTags);

  Object.keys(STYLE_PROPERTIES_TO_RESET_ON_IMAGE).forEach((property) => {
    targetElementClone.style.setProperty(
      property,
      STYLE_PROPERTIES_TO_RESET_ON_IMAGE[property as keyof typeof STYLE_PROPERTIES_TO_RESET_ON_IMAGE],
      'important'
    );
  });

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
    hasFixedPosition: elementHasFixedPosition(element),
    root: root,
    targetElement: element,
    targetElementClone: snapshotContainer.children[0].children[0] as HTMLElement,
    targetDOMPosition: {
      parentElement: element.parentElement!,
      index: Array.from(element.parentElement!.children).indexOf(element),
    },
    totalZIndex: getTotalZIndex(element, root ?? undefined),
    dynamicStates: transitionOptions.captureDynamicStates ? captureDynamicStates(element) : undefined,
  };
};

export default captureSnapshot;
