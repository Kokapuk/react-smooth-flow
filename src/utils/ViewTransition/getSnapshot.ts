import { Rect } from '../types';
import styles from './Snapshot.module.css';
import elementHasFixedPosition from './elementHasFixedPosition';
import getColorWithOpacity from './getColorWithOpacity';
import getComputedStyleNoRef from './getComputedStyleNoRef';
import getTotalZIndex from './getTotalZIndex';
import hideElementsWithTags from './hideElementsWithTags';
import { Snapshot, ViewTransitionConfig, ViewTransitionProperties } from './types';
import unifyIds from './unifyIds';

const getSnapshot = (
  targetElement: HTMLElement | null,
  excludeTags: string[],
  config: ViewTransitionConfig
): Snapshot | null => {
  if (!targetElement) {
    return null;
  }

  const computedStyle = getComputedStyleNoRef(targetElement);
  const rect = targetElement.getBoundingClientRect().toJSON() as Rect;
  const hasFixedPosition = elementHasFixedPosition(targetElement) || !!config.forceFixedPosition;
  const viewTransitionProperties = JSON.parse(targetElement.dataset.viewtransition!) as ViewTransitionProperties;

  const targetElementClone = targetElement.cloneNode(true) as HTMLElement;

  hideElementsWithTags(excludeTags, targetElementClone, config.suppressHidingTags);
  unifyIds(targetElementClone, excludeTags);

  targetElementClone.style.setProperty('background-color', 'transparent', 'important');
  targetElementClone.style.setProperty('border-radius', '0', 'important');
  targetElementClone.style.setProperty('border-width', '0', 'important');
  targetElementClone.style.setProperty('position', 'static', 'important');
  targetElementClone.style.setProperty('margin', '0', 'important');
  targetElementClone.style.setProperty('pointer-events', 'none', 'important');

  const image = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  image.style.pointerEvents = 'none';
  image.style.userSelect = 'none';
  image.style.zIndex = `${getTotalZIndex(targetElement)}`;
  image.style.left = `${rect.left}px`;
  image.style.top = `${rect.top}px`;
  image.style.width = `${rect.width}px`;
  image.style.height = `${rect.height}px`;
  image.style.backgroundColor = getColorWithOpacity(computedStyle.backgroundColor, computedStyle.opacity);
  image.style.opacity = computedStyle.opacity;

  image.style.borderTopRightRadius = computedStyle.borderTopRightRadius;
  image.style.borderBottomRightRadius = computedStyle.borderBottomRightRadius;
  image.style.borderBottomLeftRadius = computedStyle.borderBottomLeftRadius;
  image.style.borderTopLeftRadius = computedStyle.borderTopLeftRadius;

  image.style.borderTopWidth = computedStyle.borderTopWidth;
  image.style.borderRightWidth = computedStyle.borderRightWidth;
  image.style.borderBottomWidth = computedStyle.borderBottomWidth;
  image.style.borderLeftWidth = computedStyle.borderLeftWidth;

  image.style.borderTopColor = computedStyle.borderTopColor;
  image.style.borderRightColor = computedStyle.borderRightColor;
  image.style.borderBottomColor = computedStyle.borderBottomColor;
  image.style.borderLeftColor = computedStyle.borderLeftColor;

  image.style.borderTopStyle = computedStyle.borderTopStyle;
  image.style.borderRightStyle = computedStyle.borderRightStyle;
  image.style.borderBottomStyle = computedStyle.borderBottomStyle;
  image.style.borderLeftStyle = computedStyle.borderLeftStyle;

  const snapshotContainerStyles = Object.entries({
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    transform: `translate(-${computedStyle.borderLeftWidth}, -${computedStyle.borderTopWidth})`,
  })
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ');

  const snapshotContainerClasses = [
    styles.snapshotContainer,
    ...(viewTransitionProperties.contentAlign
      ? viewTransitionProperties.contentAlign.split(' ').map((i) => styles[i])
      : [styles.top, styles.left]),
  ].join(' ');

  image.innerHTML = `
    <foreignObject class="${styles.snapshotWrapper}" width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml" class="${snapshotContainerClasses}" style="${snapshotContainerStyles}">
        ${targetElementClone.outerHTML.replace(/\sdata-viewtransition=".+?"/gm, '')}
      </div>
    </foreignObject>`;

  return { rect, image, computedStyle, viewTransitionProperties, hasFixedPosition };
};

export default getSnapshot;
