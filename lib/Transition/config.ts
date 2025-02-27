import { Properties } from 'csstype';
import { ParsedTransitionProperties, TransitionProperties } from './types';

export const STYLE_PROPERTIES_TO_CAPTURE: Readonly<(keyof Properties)[]> = [
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
];

export const STYLE_PROPERTIES_TO_ANIMATE: Readonly<(keyof Properties)[]> = [
  'backgroundColor',
  'boxShadow',
  'borderRadius',
  'borderWidth',
  'borderColor',
  'borderStyle',
];

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

export const DEFAULT_TRANSITION_PROPERTIES: Readonly<
  Pick<
    ParsedTransitionProperties,
    | 'easing'
    | 'ignoreReducedMotion'
    | 'enterKeyframes'
    | 'exitKeyframes'
    | 'contentAlign'
    | 'positionAnchor'
    | 'mutationTransitionType'
    | 'overflow'
    | 'relevantStyleProperties'
  >
> = {
  easing: 'ease',
  ignoreReducedMotion: false,
  enterKeyframes: { opacity: [0, 1] },
  exitKeyframes: { opacity: [1, 0] },
  contentAlign: 'topLeft',
  positionAnchor: 'topLeft',
  mutationTransitionType: 'overlap',
  overflow: 'hidden',
  relevantStyleProperties: [],
};
