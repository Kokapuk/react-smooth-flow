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

const hideElementNoTransition = (target: HTMLElement) => {
  const transitionResetTimeout = transitionResetTimeouts.get(target);

  if (transitionResetTimeout) {
    clearTimeout(transitionResetTimeout);
    transitionResetTimeouts.delete(target);
  }

  const originalTransition = originalTransitions.get(target);

  const resetProperties: ResetProperties = {
    opacity: { value: target.style.getPropertyValue('opacity'), priority: target.style.getPropertyPriority('opacity') },
    transition: originalTransition ?? {
      value: target.style.getPropertyValue('transition'),
      priority: target.style.getPropertyPriority('transition'),
    },
    pointerEvents: {
      value: target.style.getPropertyValue('pointer-events'),
      priority: target.style.getPropertyPriority('pointer-events'),
    },
    ariaDisabled: target.ariaDisabled,
  };

  if (!originalTransition) {
    originalTransitions.set(target, resetProperties.transition);
  }

  target.style.setProperty('opacity', '0', 'important');
  target.style.setProperty('transition', 'none', 'important');
  target.style.setProperty('pointer-events', 'none', 'important');
  target.ariaDisabled = 'true';

  return () => {
    target.style.setProperty('opacity', resetProperties.opacity.value, resetProperties.opacity.priority);
    target.style.setProperty(
      'pointer-events',
      resetProperties.pointerEvents.value,
      resetProperties.pointerEvents.priority
    );
    target.ariaDisabled = resetProperties.ariaDisabled;

    const transitionResetTimeout = setTimeout(() => {
      target.style.setProperty('transition', resetProperties.transition.value, resetProperties.transition.priority);

      originalTransitions.delete(target);
      transitionResetTimeouts.delete(target);
    }) as unknown as number;

    transitionResetTimeouts.set(target, transitionResetTimeout);
  };
};

export default hideElementNoTransition;
