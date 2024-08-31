import { ComputedStyle, Snapshot } from '.';
import { Rect } from '../types';
import styles from './Snapshot.module.css';

const getSnapshot = (targetElement: HTMLElement | null): Snapshot | null => {
  if (!targetElement) {
    return null;
  }

  const computedStyle = { ...window.getComputedStyle(targetElement) } as ComputedStyle;

  const rect = targetElement.getBoundingClientRect().toJSON() as Rect;
  rect.left += window.scrollX;
  rect.top += window.scrollY;

  const resetBackgroundColor = targetElement.style.backgroundColor;
  const resetBorderRadius = targetElement.style.borderRadius;
  const resetBorderWidth = targetElement.style.borderWidth;
  targetElement.style.backgroundColor = 'transparent';
  targetElement.style.borderRadius = '0';
  targetElement.style.borderWidth = '0';

  const image = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  image.style.pointerEvents = 'none';
  image.style.userSelect = 'none';
  image.style.position = 'absolute';
  image.style.left = `${rect.left}px`;
  image.style.top = `${rect.top}px`;
  image.style.width = `${rect.width}px`;
  image.style.height = `${rect.height}px`;
  image.style.left = `${rect.left}px`;
  image.style.top = `${rect.top}px`;
  image.style.backgroundColor = computedStyle.backgroundColor;
  image.style.borderRadius = computedStyle.borderRadius;
  image.style.borderWidth = computedStyle.borderWidth;
  image.style.borderColor = computedStyle.borderColor;
  image.style.borderStyle = computedStyle.borderStyle;

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
        ${targetElement.outerHTML.replace(/\sdata-viewtransition=".+?"/gm, '')}
      </div>
    </foreignObject>`;

  targetElement.style.backgroundColor = resetBackgroundColor;
  targetElement.style.borderRadius = resetBorderRadius;
  targetElement.style.borderWidth = resetBorderWidth;

  return { rect, image, computedStyle, viewTransitionProperties: JSON.parse(targetElement.dataset.viewtransition!) };
};

export default getSnapshot;
