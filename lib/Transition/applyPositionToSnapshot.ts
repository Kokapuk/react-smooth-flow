import { Snapshot } from './types';

const setSnapshotPosition = (snapshot: Snapshot, position: 'absolute' | 'fixed') => {
  snapshot.image.style.position = position;

  if (position === 'absolute' && !snapshot.transitionProperties.transitionRootTag) {
    snapshot.rect.left += window.scrollX;
    snapshot.rect.top += window.scrollY;
    snapshot.image.style.left = `${snapshot.rect.left}px`;
    snapshot.image.style.top = `${snapshot.rect.top}px`;
  }
};

const applyPositionToSnapshot = (pairs: { prev: Snapshot | null; next: Snapshot | null }[]) => {
  for (const { prev: prevSnapshot, next: nextSnapshot } of pairs) {
    if (!prevSnapshot || !nextSnapshot) {
      ([prevSnapshot, nextSnapshot].filter(Boolean) as Snapshot[]).forEach((i) => {
        setSnapshotPosition(
          i,
          i.hasFixedPosition && !i.transitionProperties.transitionRootTag ? 'fixed' : 'absolute'
        );
      });

      continue;
    }

    [prevSnapshot, nextSnapshot].forEach((i) =>
      setSnapshotPosition(
        i,
        nextSnapshot.hasFixedPosition && !i.transitionProperties.transitionRootTag ? 'fixed' : 'absolute'
      )
    );
  }
};

export default applyPositionToSnapshot;
