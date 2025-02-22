import { ComputedStyle, ParsedTransitionProperties, TransitionProperties } from './types';

export const STYLE_PROPERTIES_TO_CAPTURE: Readonly<(keyof ComputedStyle)[]> = [
  'opacity',
  'backgroundColor',
  'boxShadow',
  'backdropFilter',

  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomRightRadius',
  'borderBottomLeftRadius',

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

  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomRightRadius',
  'borderBottomLeftRadius',

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
  'duration',
  'easing',
  'delay',
  'ignoreReducedMotion',
  'origin',
  'transitionRootTag',
  'avoidMutationTransition',
  'mutationTransitionType',
];

export const DEFAULT_TRANSITION_PROPERTIES: Readonly<
  Pick<
    ParsedTransitionProperties,
    | 'easing'
    | 'ignoreReducedMotion'
    | 'enterKeyframes'
    | 'exitKeyframes'
    | 'contentAlign'
    | 'origin'
    | 'mutationTransitionType'
    | 'overflow'
  >
> = {
  easing: 'ease',
  ignoreReducedMotion: false,
  enterKeyframes: { opacity: [0, 1] },
  exitKeyframes: { opacity: [1, 0] },
  contentAlign: 'topLeft',
  origin: 'topLeft',
  mutationTransitionType: 'overlap',
  overflow: 'hidden',
};
