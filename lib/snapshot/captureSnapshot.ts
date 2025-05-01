import { STYLE_PROPERTIES_TO_RESET_ON_IMAGE } from '@lib/defaults';
import { getRoot, getTransitionMapping } from '../registry/store';
import { Snapshot, Tag } from '../types';
import adjustBoundsToRoot from './adjustBoundsToRoot';
import captureDynamicStates from './captureDynamicStates';
import copyRelevantStyles from './copyRelevantStyles';
import elementDisableMotion from './elementDisableMotion';
import elementHasFixedPosition from './elementHasFixedPosition';
import getComputedStyleNoRef from './getComputedStyleNoRef';
import getElementBounds from './getElementBounds';
import getTotalOpacity from './getTotalOpacity';
import getTotalZIndex from './getTotalZIndex';
import hideElementWithTag from './hideElementWithTag';
import segregateIds from './segregateIds';
import segregateNames from './segregateNames';

const captureSnapshot = (element: HTMLElement, tag: Tag, excludeTags: Tag[]): Snapshot | null => {
  const resetElementMotion = elementDisableMotion(element);

  const transitionMapping = getTransitionMapping(element)!;
  const transitionOptions = transitionMapping[tag];
  const root = transitionOptions.root ? getRoot(transitionOptions.root) : null;

  if (transitionOptions.root && !root) {
    throw Error(`Failed to find root with tag "${transitionOptions.root}"`);
  }

  const computedStyle = getComputedStyleNoRef(element);

  if (computedStyle.display === 'none') {
    return null;
  }

  computedStyle.opacity = `${getTotalOpacity(element, root ?? undefined)}`;

  if (computedStyle.visibility === 'hidden') {
    computedStyle.opacity = '0';
  }

  const bounds = getElementBounds(element, transitionOptions.captureTransform);

  if (root) {
    adjustBoundsToRoot(bounds, root);
  }

  const elementClone = element.cloneNode(true) as HTMLElement;

  if (transitionOptions.relevantStyleProperties.length) {
    copyRelevantStyles(element, elementClone, transitionOptions.relevantStyleProperties);
  }

  resetElementMotion();

  excludeTags.forEach((tag) => hideElementWithTag(tag, elementClone));
  segregateIds(elementClone, excludeTags);
  segregateNames(elementClone, excludeTags);

  Object.keys(STYLE_PROPERTIES_TO_RESET_ON_IMAGE).forEach((property) => {
    elementClone.style.setProperty(
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

  transformContainer.innerHTML = elementClone.outerHTML
    .replace(/\sdata-transitioned=".+?"/gm, '')
    .replace(/\sdata-root=".+?"/gm, '');

  snapshotContainer.append(transformContainer);

  return {
    tag: tag,
    bounds,
    image: snapshotContainer,
    computedStyle,
    transitionOptions,
    transitionMapping,
    hasFixedPosition: elementHasFixedPosition(element),
    root: root,
    target: element,
    targetClone: snapshotContainer.children[0].children[0] as HTMLElement,
    targetDOMPosition: {
      parentElement: element.parentElement!,
      index: Array.from(element.parentElement!.children).indexOf(element),
    },
    totalZIndex: getTotalZIndex(element, root ?? undefined),
    dynamicStates: transitionOptions.captureDynamicStates ? captureDynamicStates(element) : undefined,
  };
};

export default captureSnapshot;
