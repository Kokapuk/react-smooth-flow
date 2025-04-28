import { Snapshot, SnapshotPair } from '../types';

const getElementByPath = (targetElement: HTMLElement, path: number[]) => {
  if (!path.length) {
    return targetElement;
  }

  const clonedPath = [...path];
  const child = targetElement.children[clonedPath.shift()!] as HTMLElement;

  return getElementByPath(child, clonedPath);
};

const applyDynamicStateToSnapshot = (snapshot: Snapshot) => {
  if (!snapshot.dynamicStates) {
    return;
  }

  snapshot.dynamicStates.forEach((state) => {
    const element = getElementByPath(snapshot.targetElementClone, state.path ?? []);

    if (state.scrollTop || state.scrollLeft) {
      element.scrollTo({ top: state.scrollTop, left: state.scrollLeft, behavior: 'instant' });
    }

    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      if (state.value) {
        element.value = state.value;
      }
    }

    if (element instanceof HTMLInputElement) {
      if (state.checked) {
        element.checked = true;
      }
    }

    if (element instanceof HTMLSelectElement && state.selectedIndex !== undefined) {
      element.selectedIndex = state.selectedIndex;
    }
  });
};

const applyDynamicStatesToPairs = (pairs: SnapshotPair[]) => {
  pairs.forEach((pair) => {
    const { prevSnapshot, nextSnapshot } = pair;

    if (prevSnapshot) {
      applyDynamicStateToSnapshot(prevSnapshot);
    }

    if (nextSnapshot) {
      applyDynamicStateToSnapshot(nextSnapshot);
    }
  });
};

export default applyDynamicStatesToPairs;
