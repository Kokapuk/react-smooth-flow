import { CONSISTENT_TRANSITION_PROPERTIES, STYLE_PROPERTIES_TO_CAPTURE } from './defaults';
import isMotionReduced from './isMotionReduced';
import { SharedTransitionProperties, Snapshot, SnapshotPair } from './types';

const getSnapshotPairs = (
  prevSnapshots: (Snapshot | null)[],
  nextSnapshots: (Snapshot | null)[]
): (SnapshotPair<'mutation'> | SnapshotPair<'enterExit'>)[] => {
  const pairs = prevSnapshots
    .map((snapshot, index) => ({ prevSnapshot: snapshot, nextSnapshot: nextSnapshots[index] }))
    .filter(
      (pair) =>
        pair.prevSnapshot?.transitionProperties.ignoreReducedMotion ||
        pair.nextSnapshot?.transitionProperties.ignoreReducedMotion ||
        !isMotionReduced()
    );

  const structuredPairs = pairs
    .map(({ prevSnapshot, nextSnapshot }) => {
      const firstValidSnapshot = (prevSnapshot ?? nextSnapshot) as Snapshot;

      if (!firstValidSnapshot) {
        return null;
      }

      const sharedTransitionProperties = Object.fromEntries(
        CONSISTENT_TRANSITION_PROPERTIES.map((property) => [
          property,
          firstValidSnapshot.transitionProperties[property],
        ])
      ) as SharedTransitionProperties;

      const sharedData = {
        tag: firstValidSnapshot.tag,
        transitionRoot: firstValidSnapshot.transitionRoot ?? null,
        transitionProperties: sharedTransitionProperties,
      };

      if (prevSnapshot && nextSnapshot && !sharedData.transitionProperties.avoidMutationTransition) {
        const bounds = firstValidSnapshot.bounds;
        const computedStyle = firstValidSnapshot.computedStyle;

        const image = document.createElement('div');
        image.className = 'rsf-image';
        image.style.overflow = sharedData.transitionProperties.overflow;
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
            transitionProperties: sharedTransitionProperties,
          },
          transitionType: 'mutation',
        };
      } else {
        let prevImage: HTMLDivElement | null = null;
        let nextImage: HTMLDivElement | null = null;

        if (prevSnapshot) {
          prevImage = document.createElement('div');
          prevImage.className = 'rsf-image';
          prevImage.style.overflow = sharedData.transitionProperties.overflow;
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
          nextImage.style.overflow = sharedData.transitionProperties.overflow;
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
            transitionProperties: sharedTransitionProperties,
          },
          transitionType: 'enterExit',
        };
      }
    })
    .filter(Boolean) as (SnapshotPair<'mutation'> | SnapshotPair<'enterExit'>)[];

  return structuredPairs;
};

export default getSnapshotPairs;
