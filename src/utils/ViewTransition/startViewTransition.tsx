import { renderToStaticMarkup } from 'react-dom/server';
import { Rect } from '../LayoutTransition';
import getContainingBlock from '../getContainingBlock';
import { ViewTransitionProperties } from './contructViewTransition';

type TransitionType = 'mutation' | 'in-out' | 'enter' | 'exit';

const getSnapshot = (tag: string, attributes: string[]) => {
  const elements = document.querySelectorAll(`[data-viewtransition*='tag":"${tag}"']`);

  if (elements.length > 1) {
    throw new Error(`Multiple elements with "${tag}" view transition tag was found`);
  }

  const element = elements[0] as HTMLElement | undefined;

  if (element) {
    const elementRect = element.getBoundingClientRect().toJSON() as Rect;
    elementRect.left += window.scrollX;
    elementRect.top += window.scrollY;

    const parentRect = getContainingBlock(element)?.getBoundingClientRect().toJSON() as Rect | undefined;

    if (parentRect) {
      parentRect.left += window.scrollX;
      parentRect.top += window.scrollY;
    }

    const html = `
        <foreignObject 
          style="user-select: none"
          width="${elementRect.width}px"
          height="${elementRect.height}px"
          ${attributes.join(' ')}>
          <div xmlns="http://www.w3.org/1999/xhtml">${element.outerHTML}</div>
        </foreignObject>
      `.replace(/\sdata-viewtransition=".+?"/gm, '');

    return {
      elementRect,
      parentRect,
      html,
      element,
      computedStyle: { ...window.getComputedStyle(element) },
      viewTransitionProperties: element.dataset.viewtransition
        ? (JSON.parse(element.dataset.viewtransition) as ViewTransitionProperties)
        : undefined,
    };
  }

  return null;
};

const startViewTransition = async (tag: string, duration: number, callback: () => void) => {
  const oldSnapshot = getSnapshot(tag, ['data-viewtransitionsnapshotversion="old"']);
  await callback();
  const newSnapshot = getSnapshot(tag, ['data-viewtransitionsnapshotversion="new"']);
  const viewTransitionRoot = document.getElementById('viewTransitionRoot')!;
  const classes = oldSnapshot?.viewTransitionProperties?.classes ?? newSnapshot?.viewTransitionProperties?.classes;
  let transitionType: TransitionType | null = null;

  if (oldSnapshot && newSnapshot) {
    transitionType = classes ? 'in-out' : 'mutation';
  } else if (oldSnapshot) {
    transitionType = 'exit';
  } else if (newSnapshot) {
    transitionType = 'enter';
  }

  if (!transitionType) {
    throw new Error('Invalid transition type');
  }

  if (newSnapshot) {
    newSnapshot.element.style.visibility = 'hidden';
  }

  if (transitionType === 'mutation') {
    const renderedSnapshot = renderToStaticMarkup(
      <svg
        xmlns="http://www.w3.org/2000/svg"
        data-viewtransitionsnapshot={tag}
        dangerouslySetInnerHTML={{
          __html: [newSnapshot!.html, oldSnapshot!.html].join(''),
        }}
        style={{ pointerEvents: 'none' }}
      />
    );

    viewTransitionRoot.insertAdjacentHTML('beforeend', renderedSnapshot);

    const snapshotElement = document.querySelector(`[data-viewtransitionsnapshot='${tag}']`) as SVGElement;
    const oldSnapshotElement = snapshotElement.querySelector(`[data-viewtransitionsnapshotversion='old']`);
    const newSnapshotElement = snapshotElement.querySelector(`[data-viewtransitionsnapshotversion='new']`);

    if (!snapshotElement || (!oldSnapshotElement && !newSnapshotElement)) {
      throw new Error('Failed to render snapshot');
    }

    snapshotElement.animate(
      [
        {
          position: 'absolute',
          width: `${oldSnapshot!.elementRect.width}px`,
          height: `${oldSnapshot!.elementRect.height}px`,
          left: `${oldSnapshot!.elementRect.left - (oldSnapshot!.parentRect?.left ?? 0)}px`,
          top: `${oldSnapshot!.elementRect.top - (oldSnapshot!.parentRect?.top ?? 0)}px`,
          borderRadius: oldSnapshot!.computedStyle.borderRadius,
        },
        {
          position: 'absolute',
          width: `${newSnapshot!.elementRect.width}px`,
          height: `${newSnapshot!.elementRect.height}px`,
          left: `${newSnapshot!.elementRect.left - (newSnapshot!.parentRect?.left ?? 0)}px`,
          top: `${newSnapshot!.elementRect.top - (newSnapshot!.parentRect?.top ?? 0)}px`,
          borderRadius: newSnapshot!.computedStyle.borderRadius,
        },
      ],
      { duration, easing: 'ease' }
    );

    if (oldSnapshotElement) {
      oldSnapshotElement.animate([{ opacity: '1' }, { opacity: '0' }], { duration, easing: 'ease' });
    } else if (newSnapshotElement) {
      newSnapshotElement.animate([{ opacity: '0' }, { opacity: '1' }], { duration, easing: 'ease' });
    }

    await new Promise((resolve) => setTimeout(resolve, duration));
    newSnapshot!.element.style.visibility = '';
    snapshotElement.remove();
  } else if (transitionType === 'enter' || transitionType === 'exit') {
    const snapshot = { enter: newSnapshot!, exit: oldSnapshot! }[transitionType];

    const renderedSnapshot = renderToStaticMarkup(
      <svg
        xmlns="http://www.w3.org/2000/svg"
        data-viewtransitionsnapshot={tag}
        dangerouslySetInnerHTML={{
          __html: [snapshot.html].join(''),
        }}
        style={{ pointerEvents: 'none' }}
      />
    );

    viewTransitionRoot.insertAdjacentHTML('beforeend', renderedSnapshot);
    const snapshotElement = document.querySelector(`[data-viewtransitionsnapshot='${tag}']`) as SVGElement;

    if (!snapshotElement) {
      throw new Error('Failed to render snapshot');
    }

    snapshotElement.style.position = 'absolute';
    snapshotElement.style.width = `${snapshot.elementRect.width}px`;
    snapshotElement.style.height = `${snapshot.elementRect.height}px`;
    snapshotElement.style.left = `${snapshot.elementRect.left}px`;
    snapshotElement.style.top = `${snapshot.elementRect.top}px`;
    snapshotElement.style.borderRadius = `${snapshot.computedStyle.borderRadius}px`;

    if (transitionType === 'enter') {
      snapshotElement.animate([{ opacity: '0' }, { opacity: '1' }], { duration, easing: 'ease' });
    } else if (transitionType === 'exit') {
      snapshotElement.animate([{ opacity: '1' }, { opacity: '0' }], { duration, easing: 'ease' });
    }

    await new Promise((resolve) => setTimeout(resolve, duration));
    snapshot.element.style.visibility = '';
    snapshotElement.remove();
  } else if (transitionType === 'in-out') {
    const renderedOldSnapshot = renderToStaticMarkup(
      <svg
        xmlns="http://www.w3.org/2000/svg"
        data-viewtransitionsnapshot={tag}
        data-viewtransitionsnapshotversion="old"
        dangerouslySetInnerHTML={{
          __html: [oldSnapshot!.html].join(''),
        }}
        style={{ pointerEvents: 'none' }}
      />
    );
    const renderedNewSnapshot = renderToStaticMarkup(
      <svg
        xmlns="http://www.w3.org/2000/svg"
        data-viewtransitionsnapshot={tag}
        data-viewtransitionsnapshotversion="new"
        dangerouslySetInnerHTML={{
          __html: [newSnapshot!.html].join(''),
        }}
        style={{ pointerEvents: 'none' }}
      />
    );

    viewTransitionRoot.insertAdjacentHTML('beforeend', renderedOldSnapshot);
    viewTransitionRoot.insertAdjacentHTML('beforeend', renderedNewSnapshot);

    const oldSnapshotElement = document.querySelector(
      `[data-viewtransitionsnapshot='${tag}'][data-viewtransitionsnapshotversion='old']`
    ) as SVGElement;
    const newSnapshotElement = document.querySelector(
      `[data-viewtransitionsnapshot='${tag}'][data-viewtransitionsnapshotversion='new']`
    ) as SVGElement;

    if (!oldSnapshotElement || !newSnapshotElement) {
      throw new Error('Failed to render snapshot');
    }

    for (const i of [
      { element: oldSnapshotElement, snapshot: oldSnapshot! },
      { element: newSnapshotElement, snapshot: newSnapshot! },
    ]) {
      i.element.style.position = 'absolute';
      i.element.style.width = `${i.snapshot.elementRect.width}px`;
      i.element.style.height = `${i.snapshot.elementRect.height}px`;
      i.element.style.left = `${i.snapshot.elementRect.left}px`;
      i.element.style.top = `${i.snapshot.elementRect.top}px`;
      i.element.style.borderRadius = `${i.snapshot.computedStyle.borderRadius}px`;
    }

    // oldSnapshotElement.animate([{ opacity: '1' }, { opacity: '0' }], { duration, easing: 'ease' });
    // newSnapshotElement.animate([{ opacity: '0' }, { opacity: '1' }], { duration, easing: 'ease' });
    
    oldSnapshotElement.classList.add(oldSnapshot!.viewTransitionProperties!.classes!.exit);
    newSnapshotElement.classList.add(newSnapshot!.viewTransitionProperties!.classes!.enter);

    await new Promise((resolve) => setTimeout(resolve, duration));
    newSnapshot!.element.style.visibility = '';
    oldSnapshotElement.remove();
    newSnapshotElement.remove();
  }
};

export default startViewTransition;
