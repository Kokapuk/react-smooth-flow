const hideElementNoTransition = (target: HTMLElement) => {
  const resetProperties = {
    opacity: target.style.opacity,
    transition: target.style.transition,
    pointerEvents: target.style.pointerEvents,
    ariaHidden: target.ariaHidden,
  };

  target.style.setProperty('opacity', '0', 'important');
  target.style.setProperty('transition', 'none', 'important');
  target.style.setProperty('pointer-events', 'none', 'important');
  target.ariaHidden = 'true';

  return () => {
    target.style.opacity = resetProperties.opacity;
    target.style.pointerEvents = resetProperties.pointerEvents;
    target.ariaHidden = resetProperties.ariaHidden;
    setTimeout(() => (target.style.transition = resetProperties.transition));
  };
};

export default hideElementNoTransition;
