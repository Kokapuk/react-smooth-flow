/* eslint-disable @typescript-eslint/no-explicit-any */
import { Rect } from '../types';
import styles from './Snapshot.module.css';
import { computedStylePropertiesToCapture } from './config';
import elementHasFixedPosition from './elementHasFixedPosition';
import getComputedStyleNoRef from './getComputedStyleNoRef';
import getElementByViewTransitionRootTag from './getElementByViewTransitionRootTag';
import getElementViewTransitionMapping from './getElementViewTransitionMapping';
import getTotalZIndex from './getTotalZIndex';
import hideElementsWithTags from './hideElementsWithTags';
import { Snapshot } from './types';
import unifyIds from './unifyIds';

const captureSnapshot = (
  targetElement: HTMLElement | null,
  targetTag: string,
  excludeTags: string[]
): Snapshot | null => {
  if (!targetElement) {
    return null;
  }

  const viewTransitionMapping = getElementViewTransitionMapping(targetElement)!;
  const computedStyle = getComputedStyleNoRef(targetElement);
  const rect = targetElement.getBoundingClientRect().toJSON() as Rect;
  const hasFixedPosition = elementHasFixedPosition(targetElement);
  const viewTransitionProperties = viewTransitionMapping[targetTag];

  const transitionRoot = viewTransitionProperties.viewTransitionRootTag
    ? (getElementByViewTransitionRootTag(viewTransitionProperties.viewTransitionRootTag) as HTMLElement | null)
    : null;

  if (!transitionRoot && viewTransitionProperties.viewTransitionRootTag) {
    throw Error(
      `Failed to get element with view transition root tag "${viewTransitionProperties.viewTransitionRootTag}"`
    );
  }

  const transitionRootRect = transitionRoot?.getBoundingClientRect().toJSON() as Rect | null;

  if (transitionRootRect) {
    rect.top -= transitionRootRect.top;
    rect.left -= transitionRootRect.left;
  }

  const targetElementClone = targetElement.cloneNode(true) as HTMLElement;

  hideElementsWithTags(excludeTags, targetElementClone);
  unifyIds(targetElementClone, excludeTags);

  targetElementClone.style.setProperty('background-color', 'transparent', 'important');
  targetElementClone.style.setProperty('border-radius', '0', 'important');
  targetElementClone.style.setProperty('border-width', '0', 'important');
  targetElementClone.style.setProperty('position', 'static', 'important');
  targetElementClone.style.setProperty('margin', '0', 'important');
  targetElementClone.style.setProperty('opacity', '1', 'important');
  targetElementClone.style.setProperty('pointer-events', 'none', 'important');
  targetElementClone.style.setProperty('box-shadow', 'none', 'important');
  targetElementClone.style.setProperty('backdrop-filter', 'none', 'important');

  const image = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  image.style.pointerEvents = 'none';
  image.style.userSelect = 'none';
  image.style.backgroundClip = 'padding-box';
  image.style.zIndex = `${getTotalZIndex(targetElement, transitionRoot ?? undefined)}`;
  image.style.left = `${rect.left}px`;
  image.style.top = `${rect.top}px`;
  image.style.width = `${rect.width}px`;
  image.style.height = `${rect.height}px`;

  computedStylePropertiesToCapture.forEach(
    (property) => (image.style[property] = computedStyle[property as any] as any)
  );

  const snapshotContainerStyles = Object.entries({
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    transform: `translate(-${computedStyle.borderLeftWidth}, -${computedStyle.borderTopWidth})`,
  })
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ');

  const snapshotContainerClasses = [
    styles.snapshotContainer,
    ...viewTransitionProperties.contentAlign.split(' ').map((i) => styles[i]),
  ].join(' ');

  image.innerHTML = `
    <foreignObject class="${styles.snapshotWrapper}" width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml" class="${snapshotContainerClasses}" style="${snapshotContainerStyles}">
        ${targetElementClone.outerHTML.replace(/\sdata-viewtransition=".+?"/gm, '')}
      </div>
    </foreignObject>`;

  return {
    tag: targetTag,
    rect,
    image,
    computedStyle,
    viewTransitionProperties,
    hasFixedPosition,
    viewTransitionRoot: transitionRoot,
  };
};

export default captureSnapshot;
