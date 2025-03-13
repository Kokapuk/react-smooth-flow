import isMotionReduced from '@lib/isMotionReduced';
import { useEffect, useState } from 'react';
import styles from './ReducedMotionAlert.module.scss';

const ReducedMotionAlert = () => {
  const [shouldAlert, setShouldAlert] = useState(isMotionReduced());

  useEffect(() => {
    const updateReducedMotion = () => {
      setShouldAlert(isMotionReduced());
    };

    window.addEventListener('focus', updateReducedMotion);
    window.addEventListener('blur', updateReducedMotion);
    document.addEventListener('visibilitychange', updateReducedMotion);

    return () => {
      window.removeEventListener('focus', updateReducedMotion);
      window.removeEventListener('blur', updateReducedMotion);
      document.removeEventListener('visibilitychange', updateReducedMotion);
    };
  });

  if (!shouldAlert) {
    return null;
  }

  return <div className={styles.alert}>Reduced motion enabled!</div>;
};

export default ReducedMotionAlert;
