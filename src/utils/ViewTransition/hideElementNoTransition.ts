const hideElementNoTransition = (target: HTMLElement) => {
  const resetStyles = {
    opacity: target.style.opacity,
    transition: target.style.transition,
    pointerEvents: target.style.pointerEvents,
  };

  target.style.opacity = '0';
  target.style.transition = 'none';
  target.style.pointerEvents = 'none';

  return () => {
    target.style.opacity = resetStyles.opacity;
    target.style.pointerEvents = resetStyles.pointerEvents;
    setTimeout(() => (target.style.transition = resetStyles.transition));
  };
};

export default hideElementNoTransition;
