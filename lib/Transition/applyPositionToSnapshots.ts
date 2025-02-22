import { Snapshot } from './types';

const setSnapshotPosition = (snapshot: Snapshot, position: 'absolute' | 'fixed') => {
  snapshot.image.style.position = position;

  if (position === 'absolute' && !snapshot.transitionRoot) {
    const documentScrollRight =
      document.documentElement.scrollWidth -
      (document.documentElement.scrollLeft + document.documentElement.clientWidth);
    const documentScrollBottom =
      document.documentElement.scrollHeight -
      (document.documentElement.scrollTop + document.documentElement.clientHeight);

    snapshot.bounds.top += window.scrollY;
    snapshot.bounds.right += documentScrollRight;
    snapshot.bounds.bottom += documentScrollBottom;
    snapshot.bounds.left += window.scrollX;
  }

  switch (snapshot.transitionProperties.origin) {
    case 'topLeft':
      snapshot.image.style.top = `${snapshot.bounds.top}px`;
      snapshot.image.style.left = `${snapshot.bounds.left}px`;
      break;
    case 'topRight':
      snapshot.image.style.top = `${snapshot.bounds.top}px`;
      snapshot.image.style.right = `${snapshot.bounds.right}px`;
      break;
    case 'bottomRight':
      snapshot.image.style.right = `${snapshot.bounds.right}px`;
      snapshot.image.style.bottom = `${snapshot.bounds.bottom}px`;
      break;
    case 'bottomLeft':
      snapshot.image.style.bottom = `${snapshot.bounds.bottom}px`;
      snapshot.image.style.left = `${snapshot.bounds.left}px`;
      break;
  }
};

const applyPositionToSnapshots = (pairs: { prev: Snapshot | null; next: Snapshot | null }[]) => {
  for (const { prev: prevSnapshot, next: nextSnapshot } of pairs) {
    if (!prevSnapshot || !nextSnapshot) {
      const snapshot = prevSnapshot ?? nextSnapshot;

      if (!snapshot) {
        continue;
      }

      setSnapshotPosition(
        snapshot,
        snapshot.hasFixedPosition && !snapshot.transitionRoot ? 'fixed' : 'absolute'
      );

      continue;
    }

    [prevSnapshot, nextSnapshot].forEach((i) =>
      setSnapshotPosition(
        i,
        nextSnapshot.hasFixedPosition && !i.transitionRoot ? 'fixed' : 'absolute'
      )
    );
  }
};

export default applyPositionToSnapshots;
