import { useState } from 'react';
import Button from '../../components/Button';
import Example from '../../components/Example';
import styles from './Gallery.module.scss';
import constructViewTransition from '../../utils/ViewTransition/constructViewTransition';
import constructViewTransitionRoot from '../../utils/ViewTransition/constructViewTransitionRoot';
import startViewTransition from '../../utils/ViewTransition/startViewTransition';
import { ViewTransitionConfig } from '../../utils/ViewTransition/types';

const galleryLength = 4;

const Gallery = () => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const toLeftConfig: [string[], ViewTransitionConfig] = [
    Array.from({ length: 4 }).map((_, index) => `slideToLeft-${index}`),
    { duration: 500, onBegin: () => setAnimationRunning(true), onFinish: () => setAnimationRunning(false) },
  ];
  const toRightConfig: [string[], ViewTransitionConfig] = [
    Array.from({ length: 4 }).map((_, index) => `slideToRight-${index}`),
    { duration: 500, onBegin: () => setAnimationRunning(true), onFinish: () => setAnimationRunning(false) },
  ];
  const [isAnimationRunning, setAnimationRunning] = useState(false);

  return (
    <Example title="Gallery">
      <div className={styles.wrapper}>
        <Button
          onClick={() =>
            startViewTransition(...toRightConfig, () => {
              setActiveSlideIndex((prev) => (prev - 1 < 0 ? galleryLength - 1 : prev - 1));
            })
          }
          disabled={isAnimationRunning}
        >
          {'<-'}
        </Button>
        <div className={styles.slideContainer} {...constructViewTransitionRoot('slideContainer')}>
          <div
            className={styles.slide}
            data-index={activeSlideIndex}
            {...constructViewTransition({
              [`slideToLeft-${activeSlideIndex}`]: {
                enterKeyframes: [{ transform: 'translateX(100%)' }, { transform: 'translateX(0)' }],
                exitKeyframes: [{ transform: 'translateX(0)' }, { transform: 'translateX(-100%)' }],
                viewTransitionRootTag: 'slideContainer',
              },
              [`slideToRight-${activeSlideIndex}`]: {
                enterKeyframes: [{ transform: 'translateX(-100%)' }, { transform: 'translateX(0)' }],
                exitKeyframes: [{ transform: 'translateX(0)' }, { transform: 'translateX(100%)' }],
                viewTransitionRootTag: 'slideContainer',
              },
            })}
          >
            {activeSlideIndex + 1}
          </div>
        </div>
        <Button
          onClick={() =>
            startViewTransition(...toLeftConfig, () => {
              setActiveSlideIndex((prev) => (prev + 1 > galleryLength - 1 ? 0 : prev + 1));
            })
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
