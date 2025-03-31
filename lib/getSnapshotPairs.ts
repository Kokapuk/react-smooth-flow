import { CONSISTENT_TRANSITION_OPTIONS, STYLE_PROPERTIES_TO_CAPTURE } from './defaults';
import isMotionReduced from './isMotionReduced';
import { Bounds, SharedTransitionOptions, Snapshot, SnapshotPair } from './types';

const createImage = (clip: boolean, bounds: Bounds) => {
  const image = document.createElement('div');
  image.className = 'rsf-image';
  image.style.overflow = clip ? 'hidden' : 'visible';
  image.style.width = `${bounds.width}px`;
  image.style.height = `${bounds.height}px`;

  return image;
};

const getSnapshotPairs = (prevSnapshots: (Snapshot | null)[], nextSnapshots: (Snapshot | null)[]): SnapshotPair[] => {
  const pairs = prevSnapshots
    .map((snapshot, index) => ({ prevSnapshot: snapshot, nextSnapshot: nextSnapshots[index] }))
    .filter(
      (pair) =>
        pair.prevSnapshot?.transitionOptions.ignoreReducedMotion ||
        pair.nextSnapshot?.transitionOptions.ignoreReducedMotion ||
        !isMotionReduced()
    );

  const structuredPairs = pairs
    .map(({ prevSnapshot, nextSnapshot }): SnapshotPair | null => {
      const firstValidSnapshot = (prevSnapshot ?? nextSnapshot) as Snapshot;

      if (!firstValidSnapshot) {
        return null;
      }

      const sharedTransitionOptions = Object.fromEntries(
        CONSISTENT_TRANSITION_OPTIONS.map((property) => [property, firstValidSnapshot.transitionOptions[property]])
      ) as SharedTransitionOptions;

      const sharedData = {
        tag: firstValidSnapshot.tag,
        transitionRoot: firstValidSnapshot.transitionRoot ?? null,
        transitionOptions: sharedTransitionOptions,
      };

      if (prevSnapshot && nextSnapshot && !sharedData.transitionOptions.forcePresenceTransition) {
        const computedStyle = firstValidSnapshot.computedStyle;
        const image = createImage(sharedData.transitionOptions.clip, firstValidSnapshot.bounds);

        STYLE_PROPERTIES_TO_CAPTURE.forEach((property) => (image.style[property] = computedStyle[property]));

        if (prevSnapshot) {
          image.append(prevSnapshot.image);
        }

        if (nextSnapshot) {
          image.append(nextSnapshot.image);
        }

        return {
          prevSnapshot,
          nextSnapshot,
          firstValidSnapshot,
          image,
          shared: sharedData,
          transitionType: 'mutation',
        };
      } else {
        let prevImage: HTMLDivElement | null = null;
        let nextImage: HTMLDivElement | null = null;

        if (prevSnapshot) {
          prevImage = createImage(sharedData.transitionOptions.clip, prevSnapshot.bounds);

          STYLE_PROPERTIES_TO_CAPTURE.forEach(
            (property) => (prevImage!.style[property] = prevSnapshot.computedStyle[property])
          );

          prevImage.append(prevSnapshot.image);
        }

        if (nextSnapshot) {
          nextImage = createImage(sharedData.transitionOptions.clip, nextSnapshot.bounds);

          STYLE_PROPERTIES_TO_CAPTURE.forEach(
            (property) => (nextImage!.style[property] = nextSnapshot.computedStyle[property])
          );

          nextImage.append(nextSnapshot.image);
        }

        return {
          prevSnapshot,
          nextSnapshot,
          firstValidSnapshot,
          prevImage,
          nextImage,
          shared: sharedData,
          transitionType: 'presence',
        };
      }
    })
    .filter(Boolean) as SnapshotPair[];

  return structuredPairs;
};

export default getSnapshotPairs;
