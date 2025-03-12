import { Snapshot, SnapshotPair } from './types';

const applyPositionToImage = (
  image: HTMLDivElement,
  position: 'absolute' | 'fixed',
  snapshot: Snapshot,
  transitionRoot: HTMLElement | null
) => {
  image.style.position = position;

  let topModifier = 0;
  let rightModifier = 0;
  let bottomModifier = 0;
  let leftModifier = 0;

  if (position === 'absolute' && !transitionRoot) {
    const documentScrollRight =
      document.documentElement.scrollWidth -
      (document.documentElement.scrollLeft + document.documentElement.clientWidth);
    const documentScrollBottom =
      document.documentElement.scrollHeight -
      (document.documentElement.scrollTop + document.documentElement.clientHeight);

    topModifier = window.scrollY;
    rightModifier = documentScrollRight;
    bottomModifier = documentScrollBottom;
    leftModifier = window.scrollX;
  }

  switch (snapshot.transitionProperties.positionAnchor) {
    case 'topLeft':
      image.style.top = `${snapshot.bounds.top + topModifier}px`;
      image.style.left = `${snapshot.bounds.left + leftModifier}px`;
      break;
    case 'topRight':
      image.style.top = `${snapshot.bounds.top + topModifier}px`;
      image.style.right = `${snapshot.bounds.right + rightModifier}px`;
      break;
    case 'bottomRight':
      image.style.right = `${snapshot.bounds.right + rightModifier}px`;
      image.style.bottom = `${snapshot.bounds.bottom + bottomModifier}px`;
      break;
    case 'bottomLeft':
      image.style.bottom = `${snapshot.bounds.bottom + bottomModifier}px`;
      image.style.left = `${snapshot.bounds.left + leftModifier}px`;
      break;
  }
};

const applyPositionToSnapshotPairs = (pairs: SnapshotPair<'mutation' | 'enterExit'>[]) => {
  pairs.forEach((pair) => {
    if (pair.transitionType === 'mutation') {
      const { prevSnapshot, nextSnapshot, image, shared, firstValidSnapshot } = pair as SnapshotPair<'mutation'>;

      const lastValidSnapshot = (nextSnapshot ?? prevSnapshot) as Snapshot;
      const position = lastValidSnapshot.hasFixedPosition && !lastValidSnapshot.transitionRoot ? 'fixed' : 'absolute';
      applyPositionToImage(image, position, firstValidSnapshot, shared.transitionRoot);
    } else if (pair.transitionType === 'enterExit') {
      const { prevSnapshot, nextSnapshot, prevImage, nextImage, shared } = pair as SnapshotPair<'enterExit'>;
      const snapshotImagePairs = [
        { snapshot: prevSnapshot, image: prevImage },
        { snapshot: nextSnapshot, image: nextImage },
      ].filter(({ snapshot, image }) => snapshot && image) as {
        snapshot: Snapshot;
        image: HTMLDivElement;
      }[];

      snapshotImagePairs.forEach(({ snapshot, image }) => {
        const position = snapshot.hasFixedPosition && !snapshot.transitionRoot ? 'fixed' : 'absolute';
        applyPositionToImage(image, position, snapshot, shared.transitionRoot);
      });
    }
  });
};

export default applyPositionToSnapshotPairs;
