import { Rect } from '../types';
import styles from './Snapshot.module.css';
import getColorWithOpacity from './getColorWithOpacity';
import getComputedStyleNoRef from './getComputedStyleNoRef';
import getElementByViewTransitionTag from './getElementByViewTransitionTag';
import getTotalZIndex from './getTotalZIndex';
import hasFixedPosition from './hasFixedPosition';
import { Snapshot, ViewTransitionConfig } from './types';

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
  const hasFixedPos = hasFixedPosition(targetElement);

  if (!hasFixedPos && !config.forceFixedPos) {
    rect.left += window.scrollX;
    rect.top += window.scrollY;
  }

  const targetElementClone = targetElement.cloneNode(true) as HTMLElement;

  excludeTags.forEach((tag) => {
    if (config.suppressHidingTags?.includes(tag)) {
      return;
    }

    const element = getElementByViewTransitionTag(tag, targetElementClone) as HTMLElement | null;

    if (element) {
      element.style.visibility = 'hidden';
    }
  });

  targetElementClone.style.setProperty('background-color', 'transparent', 'important');
  targetElementClone.style.setProperty('border-radius', '0', 'important');
  targetElementClone.style.setProperty('border-width', '0', 'important');
  targetElementClone.style.setProperty('position', 'static', 'important');
  targetElementClone.style.setProperty('margin', '0', 'important');

  const image = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  image.style.pointerEvents = 'none';
  image.style.userSelect = 'none';
  image.style.zIndex = `${getTotalZIndex(targetElement)}`;
  image.style.position = hasFixedPos || config.forceFixedPos ? 'fixed' : 'absolute';
  image.style.left = `${rect.left}px`;
  image.style.top = `${rect.top}px`;
  image.style.width = `${rect.width}px`;
  image.style.height = `${rect.height}px`;
  image.style.left = `${rect.left}px`;
  image.style.top = `${rect.top}px`;
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

  const foreignObjectStyles = {
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    transform: `translate(-${computedStyle.borderLeftWidth}, -${computedStyle.borderTopWidth})`,
  };

  image.innerHTML = `
    <foreignObject style="${Object.entries(foreignObjectStyles)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ')}">
      <div class="${styles.snapshotContainer}" xmlns="http://www.w3.org/1999/xhtml">
        ${targetElementClone.outerHTML.replace(/\sdata-viewtransition=".+?"/gm, '')}
      </div>
    </foreignObject>`;

  return { rect, image, computedStyle, viewTransitionProperties: JSON.parse(targetElement.dataset.viewtransition!) };
};

export default getSnapshot;
