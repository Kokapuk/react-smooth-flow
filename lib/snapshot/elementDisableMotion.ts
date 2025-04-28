const elementDisableMotion = (element: HTMLElement) => {
  const resetTransitionValue = element.style.getPropertyValue('transition');
  const resetTransitionPriority = element.style.getPropertyPriority('transition');
  const resetAnimationValue = element.style.getPropertyValue('animation');
  const resetAnimationPriority = element.style.getPropertyPriority('animation');

  element.style.setProperty('transition', 'none', 'important');
  element.style.setProperty('animation', 'none', 'important');

  return () => {
    element.style.setProperty('transition', resetTransitionValue, resetTransitionPriority);
    element.style.setProperty('animation', resetAnimationValue, resetAnimationPriority);
  };
};

export default elementDisableMotion;
