export interface ViewTransitionProperties {
  tag: string;
  classes?: { enter: string; exit: string };
}

const constructViewTransition = (properties: ViewTransitionProperties) => ({
  'data-viewtransition': JSON.stringify(properties),
});

export default constructViewTransition;