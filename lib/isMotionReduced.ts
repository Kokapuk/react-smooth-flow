const isMotionReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default isMotionReduced;
