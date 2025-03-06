import { Properties } from 'csstype';
import { ParsedTransitionProperties, TransitionProperties } from './types';

export const STYLE_PROPERTIES_TO_CAPTURE = [
  'opacity',
  'backgroundColor',
  'boxShadow',
  'backdropFilter',
  'borderRadius',
  'borderWidth',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderColor',
  'borderStyle',
] as const satisfies Readonly<(keyof Properties)[]>;

export const STYLE_PROPERTIES_TO_ANIMATE = [
  'backgroundColor',
  'boxShadow',
  'borderRadius',
  'borderWidth',
  'borderColor',
  'borderStyle',
] as const satisfies Readonly<(typeof STYLE_PROPERTIES_TO_CAPTURE)[number][]>;

export const CONSISTENT_TRANSITION_PROPERTIES: Readonly<(keyof TransitionProperties)[]> = [
  'duration',
  'easing',
  'delay',
  'ignoreReducedMotion',
  'positionAnchor',
  'transitionRootTag',
  'avoidMutationTransition',
  'mutationTransitionType',
];

export const DEFAULT_TRANSITION_PROPERTIES = {
  easing: 'ease',
  ignoreReducedMotion: false,
  enterKeyframes: { opacity: [0, 1] },
  exitKeyframes: { opacity: [1, 0] },
  contentAlign: 'topLeft',
  positionAnchor: 'topLeft',
  mutationTransitionType: 'overlap',
  overflow: 'hidden',
  relevantStyleProperties: [],
  disabled: false,
} as const satisfies Partial<ParsedTransitionProperties>;
