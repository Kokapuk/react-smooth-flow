import { CONSISTENT_TRANSITION_OPTIONS, STYLE_PROPERTIES_TO_CAPTURE } from './defaults';
import isMotionReduced from './isMotionReduced';
import { SharedTransitionOptions, Snapshot, SnapshotPair } from './types';

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
        const bounds = firstValidSnapshot.bounds;
        const computedStyle = firstValidSnapshot.computedStyle;

        const image = document.createElement('div');
        image.className = 'rsf-image';
        image.style.overflow = sharedData.transitionOptions.overflow;
        image.style.width = `${bounds.width}px`;
        image.style.height = `${bounds.height}px`;

        STYLE_PROPERTIES_TO_CAPTURE.forEach((property) => (image.style[property] = computedStyle[property]));

        prevSnapshot && image.append(prevSnapshot.image);
        nextSnapshot && image.append(nextSnapshot.image);

        return {
          prevSnapshot,
          nextSnapshot,
          firstValidSnapshot,
          image,
          shared: {
            tag: firstValidSnapshot.tag,
            transitionRoot: firstValidSnapshot.transitionRoot ?? null,
            transitionOptions: sharedTransitionOptions,
          },
          transitionType: 'mutation',
        };
      } else {
        let prevImage: HTMLDivElement | null = null;
        let nextImage: HTMLDivElement | null = null;

        if (prevSnapshot) {
          prevImage = document.createElement('div');
          prevImage.className = 'rsf-image';
          prevImage.style.overflow = sharedData.transitionOptions.overflow;
          prevImage.style.width = `${prevSnapshot.bounds.width}px`;
          prevImage.style.height = `${prevSnapshot.bounds.height}px`;

          STYLE_PROPERTIES_TO_CAPTURE.forEach(
            (property) => (prevImage!.style[property] = prevSnapshot.computedStyle[property])
          );

          prevImage.append(prevSnapshot.image);
        }

        if (nextSnapshot) {
          nextImage = document.createElement('div');
          nextImage.className = 'rsf-image';
          nextImage.style.overflow = sharedData.transitionOptions.overflow;
          nextImage.style.width = `${nextSnapshot.bounds.width}px`;
          nextImage.style.height = `${nextSnapshot.bounds.height}px`;

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
          shared: {
            tag: firstValidSnapshot.tag,
            transitionRoot: firstValidSnapshot.transitionRoot ?? null,
            transitionOptions: sharedTransitionOptions,
          },
          transitionType: 'presence',
        };
      }
    })
    .filter(Boolean) as SnapshotPair[];

  return structuredPairs;
};

export default getSnapshotPairs;
