import { renderToStaticMarkup } from 'react-dom/server';
import getContainingBlock from '../getContainingBlock';
import { Rect } from '../types';
import { ViewTransitionProperties } from './constructViewTransition';
import styles from './Snapshot.module.css';

type TransitionType = 'mutation' | 'in-out' | 'enter' | 'exit';

interface Snapshot {
  elementRect: Rect;
  parentRect?: Rect;
  html: string;
  element: HTMLElement;
  computedStyle: CSSStyleDeclaration;
  viewTransitionProperties: ViewTransitionProperties;
}

interface ViewTransitionConfig {
  duration: number;
  easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  noInOut?: boolean;
}

const activeTransitions: { [key: string]: Animation[] } = {};

const startViewTransition = async (tags: string[], config: ViewTransitionConfig, modifyDom: () => void) => {
  const oldSnapshots: (Snapshot | null)[] = [];
  const newSnapshots: (Snapshot | null)[] = [];

  for (const tag of tags) {
    oldSnapshots.push(
      getSnapshot(
        tag,
        tags.filter((i) => i !== tag),
        ['data-viewtransitionsnapshotversion="old"']
      )
    );
  }

  await modifyDom();

  for (const tag of tags) {
    newSnapshots.push(
      getSnapshot(
        tag,
        tags.filter((i) => i !== tag),
        ['data-viewtransitionsnapshotversion="new"']
      )
    );
  }

  for (let i = 0; i < tags.length; i++) {
    const oldSnapshot = oldSnapshots[i];
    const newSnapshot = newSnapshots[i];
    const tag = tags[i];
    playTransition(oldSnapshot, newSnapshot, tag, config);
  }
};

const getSnapshot = (tag: string, restTags: string[], attributes: string[]): Snapshot | null => {
  const elements = document.querySelectorAll(`[data-viewtransition*='tag":"${tag}"']`);

  if (elements.length > 1) {
    throw new Error(`Multiple elements with "${tag}" view transition tag was found`);
  }

  const element = elements.length ? (elements[0] as HTMLElement) : null;

  if (element) {
    const elementRect = element.getBoundingClientRect().toJSON() as Rect;
    elementRect.left += window.scrollX;
    elementRect.top += window.scrollY;

    const parentRect = getContainingBlock(element)?.getBoundingClientRect().toJSON() as Rect | undefined;

    if (parentRect) {
      parentRect.left += window.scrollX;
      parentRect.top += window.scrollY;
    }

    setActiveSnapshotsVisible(element, restTags, false);
    const resetBgColor = element.style.backgroundColor;
    const resetBorderRadius = element.style.borderRadius;
    element.style.backgroundColor = 'transparent';
    element.style.borderRadius = '0';

    const html = `
    <foreignObject 
      style="user-select: none"
      width="${elementRect.width}px"
      height="${elementRect.height}px"
      ${attributes.join(' ')}>
        <div class="${styles.snapshotContainer}" xmlns="http://www.w3.org/1999/xhtml">
          ${element.outerHTML.replace(/<.*?>/m, (match) => match.replace(/visibility: hidden;?/m, ''))}
        </div>
    </foreignObject>
    `.replace(/\sdata-viewtransition=".+?"/gm, '');

    setActiveSnapshotsVisible(element, restTags, true);
    element.style.backgroundColor = resetBgColor;
    element.style.borderRadius = resetBorderRadius;

    return {
      elementRect,
      parentRect,
      html,
      element,
      computedStyle: { ...window.getComputedStyle(element) },
      viewTransitionProperties: JSON.parse(element.dataset.viewtransition!) as ViewTransitionProperties,
    };
  }

  return null;
};

const setActiveSnapshotsVisible = (element: HTMLElement, tags: string[], visible: boolean) => {
  for (const child of element.childNodes) {
    if (!(child instanceof HTMLElement)) {
      continue;
    }

    const serializedViewTransitionProperties = child.getAttribute('data-viewtransition');

    if (serializedViewTransitionProperties) {
      const viewTransitionProperties: ViewTransitionProperties = JSON.parse(serializedViewTransitionProperties);

      if (tags.includes(viewTransitionProperties.tag)) {
        child.style.visibility = visible ? '' : 'hidden';
        continue;
      }
    }

    setActiveSnapshotsVisible(child, tags, visible);
  }
};

const playTransition = (
  oldSnapshot: Snapshot | null,
  newSnapshot: Snapshot | null,
  tag: string,
  config: ViewTransitionConfig
) => {
  const viewTransitionRoot = document.getElementById('viewTransitionRoot')!;
  const animationClass =
    oldSnapshot?.viewTransitionProperties.animationClass ?? newSnapshot?.viewTransitionProperties.animationClass;
  let transitionType: TransitionType | null = null;

  if (oldSnapshot && newSnapshot) {
    transitionType = animationClass && !config.noInOut ? 'in-out' : 'mutation';
  } else if (oldSnapshot) {
    transitionType = 'exit';
  } else if (newSnapshot) {
    transitionType = 'enter';
  }

  if (!transitionType) {
    return;
  }

  if (!activeTransitions[tag]) {
    activeTransitions[tag] = [];
  }

  if (newSnapshot) {
    newSnapshot.element.style.visibility = 'hidden';
  }

  activeTransitions[tag].forEach((i) => i.cancel());
  const previousSnapshotElements = document.querySelectorAll(`[data-viewtransitionsnapshot='${tag}']`);
  previousSnapshotElements.forEach((i) => i.remove());

  if (transitionType === 'mutation') {
    playMutationTransition(viewTransitionRoot, oldSnapshot!, newSnapshot!, tag, config);
  } else if (transitionType === 'enter' || transitionType === 'exit') {
    playEnterExitTransition(viewTransitionRoot, oldSnapshot!, newSnapshot!, tag, config, transitionType);
  } else if (transitionType === 'in-out') {
    playInOutTransition(viewTransitionRoot, oldSnapshot!, newSnapshot!, tag);
  }
};

const playMutationTransition = (
  viewTransitionRoot: HTMLElement,
  oldSnapshot: Snapshot,
  newSnapshot: Snapshot,
  tag: string,
  config: ViewTransitionConfig
) => {
  const renderedSnapshot = renderToStaticMarkup(
    <svg
      xmlns="http://www.w3.org/2000/svg"
      data-viewtransitionsnapshot={tag}
      dangerouslySetInnerHTML={{
        __html: [newSnapshot!.html, oldSnapshot!.html].join(''),
      }}
      style={{
        pointerEvents: 'none',
        backgroundColor: window.getComputedStyle(newSnapshot!.element).backgroundColor,
      }}
    />
  );

  viewTransitionRoot.insertAdjacentHTML('beforeend', renderedSnapshot);

  const snapshotElement = document.querySelector(`[data-viewtransitionsnapshot='${tag}']`) as SVGElement;
  const oldSnapshotElement = snapshotElement.querySelector(`[data-viewtransitionsnapshotversion='old']`);
  const newSnapshotElement = snapshotElement.querySelector(`[data-viewtransitionsnapshotversion='new']`);

  if (!snapshotElement || !oldSnapshotElement || !newSnapshotElement) {
    throw new Error('Failed to render snapshot');
  }

  const rootTransition = snapshotElement.animate(
    [
      {
        position: 'absolute',
        width: `${oldSnapshot!.elementRect.width}px`,
        height: `${oldSnapshot!.elementRect.height}px`,
        left: `${oldSnapshot!.elementRect.left - (oldSnapshot!.parentRect?.left ?? 0)}px`,
        top: `${oldSnapshot!.elementRect.top - (oldSnapshot!.parentRect?.top ?? 0)}px`,
        borderRadius: oldSnapshot!.computedStyle.borderRadius,
        backgroundColor: oldSnapshot!.computedStyle.backgroundColor,
      },
      {
        position: 'absolute',
        width: `${newSnapshot!.elementRect.width}px`,
        height: `${newSnapshot!.elementRect.height}px`,
        left: `${newSnapshot!.elementRect.left - (newSnapshot!.parentRect?.left ?? 0)}px`,
        top: `${newSnapshot!.elementRect.top - (newSnapshot!.parentRect?.top ?? 0)}px`,
        borderRadius: newSnapshot!.computedStyle.borderRadius,
        backgroundColor: newSnapshot!.computedStyle.backgroundColor,
      },
    ],
    { duration: config.duration, easing: config.easing ?? 'ease' }
  );

  const innerOldTransition = oldSnapshotElement.animate([{ opacity: '1' }, { opacity: '0' }], {
    duration: config.duration,
    easing: config.easing ?? 'ease',
  });
  const innerNewTransition = newSnapshotElement.animate([{ opacity: '0' }, { opacity: '1' }], {
    duration: config.duration,
    easing: config.easing ?? 'ease',
  });

  activeTransitions[tag] = [rootTransition, innerOldTransition, innerNewTransition];

  innerNewTransition.onfinish = () => {
    newSnapshot!.element.style.visibility = '';
    snapshotElement.remove();
  };
};

const playEnterExitTransition = (
  viewTransitionRoot: HTMLElement,
  oldSnapshot: Snapshot,
  newSnapshot: Snapshot,
  tag: string,
  config: ViewTransitionConfig,
  transitionType: Extract<TransitionType, 'enter' | 'exit'>
) => {
  const snapshot = { enter: newSnapshot!, exit: oldSnapshot! }[transitionType];

  const renderedSnapshot = renderToStaticMarkup(
    <svg
      xmlns="http://www.w3.org/2000/svg"
      data-viewtransitionsnapshot={tag}
      className={snapshot.viewTransitionProperties.animationClass}
      dangerouslySetInnerHTML={{
        __html: [snapshot.html].join(''),
      }}
      style={{
        pointerEvents: 'none',
        backgroundColor: snapshot.computedStyle.backgroundColor,
        borderRadius: snapshot.computedStyle.borderRadius,
      }}
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

  if (snapshot.viewTransitionProperties.animationClass) {
    snapshotElement.classList.add(transitionType);

    snapshotElement.onanimationend = () => {
      snapshot.element.style.visibility = '';
      snapshotElement.remove();
    };
  } else {
    let transition: Animation;

    if (transitionType === 'enter') {
      transition = snapshotElement.animate([{ opacity: '0' }, { opacity: '1' }], {
        duration: config.duration,
        easing: config.easing ?? 'ease',
      });
    } else if (transitionType === 'exit') {
      transition = snapshotElement.animate([{ opacity: '1' }, { opacity: '0' }], {
        duration: config.duration,
        easing: config.easing ?? 'ease',
      });
    }

    activeTransitions[tag] = [transition!];

    transition!.onfinish = () => {
      snapshot.element.style.visibility = '';
      snapshotElement.remove();
    };
  }
};

const playInOutTransition = (
  viewTransitionRoot: HTMLElement,
  oldSnapshot: Snapshot,
  newSnapshot: Snapshot,
  tag: string
) => {
  const renderedOldSnapshot = renderToStaticMarkup(
    <svg
      xmlns="http://www.w3.org/2000/svg"
      data-viewtransitionsnapshot={tag}
      data-viewtransitionsnapshotversion="old"
      className={oldSnapshot.viewTransitionProperties.animationClass}
      dangerouslySetInnerHTML={{ __html: [oldSnapshot!.html].join('') }}
      style={{
        pointerEvents: 'none',
        backgroundColor: oldSnapshot.computedStyle.backgroundColor,
        borderRadius: oldSnapshot.computedStyle.borderRadius,
      }}
    />
  );
  const renderedNewSnapshot = renderToStaticMarkup(
    <svg
      xmlns="http://www.w3.org/2000/svg"
      data-viewtransitionsnapshot={tag}
      data-viewtransitionsnapshotversion="new"
      className={newSnapshot.viewTransitionProperties.animationClass}
      dangerouslySetInnerHTML={{ __html: [newSnapshot!.html].join('') }}
      style={{
        pointerEvents: 'none',
        backgroundColor: newSnapshot.computedStyle.backgroundColor,
        borderRadius: newSnapshot.computedStyle.borderRadius,
      }}
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

  oldSnapshotElement.classList.add('exit');
  newSnapshotElement.classList.add('enter');

  newSnapshotElement.onanimationend = () => {
    newSnapshot!.element.style.visibility = '';
    oldSnapshotElement.remove();
    newSnapshotElement.remove();
  };
};

export default startViewTransition;
