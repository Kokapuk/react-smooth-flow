interface ResetStyleProperty {
  value: string;
  priority: string;
}

interface ResetProperties {
  opacity: ResetStyleProperty;
  transition: ResetStyleProperty;
  pointerEvents: ResetStyleProperty;
  ariaDisabled: string | null;
}

const originalTransitions = new WeakMap<HTMLElement, ResetStyleProperty>();
const transitionResetTimeouts = new WeakMap<HTMLElement, number>();

const hideElementNoTransition = (element: HTMLElement) => {
  const transitionResetTimeout = transitionResetTimeouts.get(element);

  if (transitionResetTimeout) {
    clearTimeout(transitionResetTimeout);
    transitionResetTimeouts.delete(element);
  }

  const originalTransition = originalTransitions.get(element);

  const resetProperties: ResetProperties = {
    opacity: {
      value: element.style.getPropertyValue('opacity'),
      priority: element.style.getPropertyPriority('opacity'),
    },
    transition: originalTransition ?? {
      value: element.style.getPropertyValue('transition'),
      priority: element.style.getPropertyPriority('transition'),
    },
    pointerEvents: {
      value: element.style.getPropertyValue('pointer-events'),
      priority: element.style.getPropertyPriority('pointer-events'),
    },
    ariaDisabled: element.ariaDisabled,
  };

  if (!originalTransition) {
    originalTransitions.set(element, resetProperties.transition);
  }

  element.style.setProperty('opacity', '0', 'important');
  element.style.setProperty('transition', 'none', 'important');
  element.style.setProperty('pointer-events', 'none', 'important');
  element.ariaDisabled = 'true';

  return () => {
    element.style.setProperty('opacity', resetProperties.opacity.value, resetProperties.opacity.priority);
    element.style.setProperty(
      'pointer-events',
      resetProperties.pointerEvents.value,
      resetProperties.pointerEvents.priority
    );
    element.ariaDisabled = resetProperties.ariaDisabled;

    const transitionResetTimeout = setTimeout(() => {
      element.style.setProperty('transition', resetProperties.transition.value, resetProperties.transition.priority);

      originalTransitions.delete(element);
      transitionResetTimeouts.delete(element);
    }) as unknown as number;

    transitionResetTimeouts.set(element, transitionResetTimeout);
  };
};

export default hideElementNoTransition;
