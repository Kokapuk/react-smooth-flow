export interface ViewTransitionProperties {
  tag: string;
  animationClass?: string;
}

const constructViewTransition = (properties: ViewTransitionProperties) => ({
  'data-viewtransition': JSON.stringify(properties),
});

export default constructViewTransition;
