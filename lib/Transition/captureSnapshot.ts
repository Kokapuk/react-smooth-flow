/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './Snapshot.module.css';
import { computedStylePropertiesToCapture } from './config';
import detectBrowser from './detectBrowser';
import elementHasFixedPosition from './elementHasFixedPosition';
import getComputedStyleNoRef from './getComputedStyleNoRef';
import getElementByTransitionRootTag from './getElementByTransitionRootTag';
import getElementTransitionMapping from './getElementTransitionMapping';
import getTotalZIndex from './getTotalZIndex';
import hideElementsWithTags from './hideElementsWithTags';
import { Rect, Snapshot } from './types';
import unifyIds from './unifyIds';

const captureSnapshot = (
  targetElement: HTMLElement | null,
  targetTag: string,
  excludeTags: string[]
): Snapshot | null => {
  if (!targetElement) {
    return null;
  }

  const detectedBrowser = detectBrowser();
  const transitionMapping = getElementTransitionMapping(targetElement)!;
  const computedStyle = getComputedStyleNoRef(targetElement);
  const rect = targetElement.getBoundingClientRect().toJSON() as Rect;
  const hasFixedPosition = elementHasFixedPosition(targetElement);
  const transitionProperties = transitionMapping[targetTag];

  const transitionRoot = transitionProperties.transitionRootTag
    ? (getElementByTransitionRootTag(transitionProperties.transitionRootTag) as HTMLElement | null)
    : null;

  if (transitionProperties.transitionRootTag && !transitionRoot) {
    throw Error(`Failed to find transition root with tag "${transitionProperties.transitionRootTag}"`);
  }

  const transitionRootComputedStyle = transitionRoot ? getComputedStyle(transitionRoot) : null;

  if (transitionRootComputedStyle?.position === 'static') {
    console.warn(
      `Transition root with tag "${transitionProperties.transitionRootTag}" has position property set to "static". This may cause visual transition issues`
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
  image.style.clipPath =
    detectedBrowser === 'webkit'
      ? `inset(0 0 0 0 round ${computedStyle.borderTopLeftRadius} ${computedStyle.borderTopRightRadius} ${computedStyle.borderBottomRightRadius} ${computedStyle.borderBottomLeftRadius})`
      : '';

  computedStylePropertiesToCapture.forEach((property) => (image.style[property] = computedStyle[property]));

  const snapshotContainerStyles = Object.entries({
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    transform:
      detectedBrowser !== 'webkit'
        ? `translate(-${computedStyle.borderLeftWidth}, -${computedStyle.borderTopWidth})`
        : null,
  })
    .filter(([_, value]) => Boolean(value))
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ');

  const snapshotContainerClasses = [
    styles.snapshotContainer,
    ...transitionProperties.contentAlign.split(' ').map((i) => styles[i]),
  ].join(' ');

  image.innerHTML = `
    <foreignObject class="${styles.snapshotWrapper}" width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml" class="${snapshotContainerClasses}" style="${snapshotContainerStyles}">
        ${targetElementClone.outerHTML
          .replace(/\sdata-transition=".+?"/gm, '')
          .replace(/\sdata-transitionroot=".+?"/gm, '')}
      </div>
    </foreignObject>`;

  return {
    tag: targetTag,
    rect,
    image,
    computedStyle,
    transitionProperties,
    hasFixedPosition,
    transitionRoot,
    targetElement,
  };
};

export default captureSnapshot;
