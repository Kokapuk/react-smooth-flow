import { ComputedStyle, ParsedTransitionProperties, TransitionProperties } from './types';

export const STYLE_PROPERTIES_TO_CAPTURE: Readonly<(keyof ComputedStyle)[]> = [
  'opacity',
  'backgroundColor',
  'color',
  'boxShadow',
  'backdropFilter',

  'borderTopRightRadius',
  'borderBottomRightRadius',
  'borderBottomLeftRadius',
  'borderTopLeftRadius',

  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',

  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',

  'borderTopStyle',
  'borderRightStyle',
  'borderBottomStyle',
  'borderLeftStyle',
];

export const STYLE_PROPERTIES_TO_ANIMATE: Readonly<(keyof ComputedStyle)[]> = [
  'backgroundColor',
  'boxShadow',

  'borderTopRightRadius',
  'borderBottomRightRadius',
  'borderBottomLeftRadius',
  'borderTopLeftRadius',

  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',

  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',

  'borderTopStyle',
  'borderRightStyle',
  'borderBottomStyle',
  'borderLeftStyle',
];

export const CONSISTENT_TRANSITION_PROPERTIES: Readonly<(keyof TransitionProperties)[]> = [
  'transitionRootTag',
  'avoidMutationTransition',
  'mutationTransitionType',
];

export const DEFAULT_TRANSITION_PROPERTIES: Readonly<
  Pick<
    ParsedTransitionProperties,
    'enterKeyframes' | 'exitKeyframes' | 'contentAlign' | 'mutationTransitionType' | 'overflow'
  >
> = {
  enterKeyframes: { opacity: [0, 1] },
  exitKeyframes: { opacity: [1, 0] },
  contentAlign: 'topLeft',
  mutationTransitionType: 'overlap',
  overflow: 'hidden',
};
