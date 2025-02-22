import { constructTransition, constructTransitionRoot, startTransition } from '@lib/main';
import { useState } from 'react';
import Button from '../../components/Button';
import Example from '../../components/Example';
import styles from './Gallery.module.scss';

const galleryLength = 4;

const Gallery = () => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isAnimationRunning, setAnimationRunning] = useState(false);

  return (
    <Example title="Gallery">
      <div className={styles.wrapper}>
        <Button
          onClick={() =>
            startTransition(
              Array.from({ length: 4 }).map((_, index) => `slideToRight-${index}`),
              () => {
                setActiveSlideIndex((prev) => (prev - 1 < 0 ? galleryLength - 1 : prev - 1));
              },
              { onBegin: () => setAnimationRunning(true), onFinish: () => setAnimationRunning(false) }
            )
          }
          disabled={isAnimationRunning}
        >
          {'<-'}
        </Button>
        <div className={styles.slideContainer} {...constructTransitionRoot('slideContainer')}>
          <div
            className={styles.slide}
            data-index={activeSlideIndex}
            {...constructTransition({
              [`slideToLeft-${activeSlideIndex}`]: {
                enterKeyframes: [{ transform: 'translateX(100%)' }, { transform: 'translateX(0)' }],
                exitKeyframes: [{ transform: 'translateX(0)' }, { transform: 'translateX(-100%)' }],
                transitionRootTag: 'slideContainer',
                duration: 500,
              },
              [`slideToRight-${activeSlideIndex}`]: {
                enterKeyframes: [{ transform: 'translateX(-100%)' }, { transform: 'translateX(0)' }],
                exitKeyframes: [{ transform: 'translateX(0)' }, { transform: 'translateX(100%)' }],
                transitionRootTag: 'slideContainer',
                duration: 500,
              },
            })}
          >
            {activeSlideIndex + 1}
          </div>
        </div>
        <Button
          onClick={() =>
            startTransition(
              Array.from({ length: 4 }).map((_, index) => `slideToLeft-${index}`),
              () => {
                setActiveSlideIndex((prev) => (prev + 1 > galleryLength - 1 ? 0 : prev + 1));
              },
              { onBegin: () => setAnimationRunning(true), onFinish: () => setAnimationRunning(false) }
            )
          }
          disabled={isAnimationRunning}
        >
          {'->'}
        </Button>
      </div>
    </Example>
  );
};

export default Gallery;
