const hideElementNoTransition = (target: HTMLElement) => {
  const resetStyles = {
    opacity: target.style.opacity,
    transition: target.style.transition,
    pointerEvents: target.style.pointerEvents,
  };

  target.style.setProperty('opacity', '0', 'important');
  target.style.setProperty('transition', 'none', 'important');
  target.style.setProperty('pointer-events', 'none', 'important');

  return () => {
    target.style.opacity = resetStyles.opacity;
    target.style.pointerEvents = resetStyles.pointerEvents;
    setTimeout(() => (target.style.transition = resetStyles.transition));
  };
};

export default hideElementNoTransition;
