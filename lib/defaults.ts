import { Properties } from 'csstype';
import { ParsedTransitionProperties, Snapshot, TransitionProperties } from './types';

export interface ConfigurableDefaults {
  defaultTransitionProperties: ParsedTransitionProperties;
}

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
  'opacity',
  'backgroundColor',
  'boxShadow',
  'borderRadius',
  'borderWidth',
  'borderColor',
  'borderStyle',
] as const satisfies Readonly<(typeof STYLE_PROPERTIES_TO_CAPTURE)[number][]>;

export const CONSISTENT_TRANSITION_PROPERTIES = [
  'duration',
  'easing',
  'delay',
  'ignoreReducedMotion',
  'positionAnchor',
  'transitionRootTag',
  'avoidMutationTransition',
  'mutationTransitionType',
  'overflow',
] as const satisfies Readonly<(keyof TransitionProperties)[]>;

export const CONSISTENT_SNAPSHOT_PROPERTIES = ['tag', 'transitionRoot'] as const satisfies Readonly<(keyof Snapshot)[]>;

const defaults: ConfigurableDefaults = {
  defaultTransitionProperties: {
    duration: 300,
    easing: 'ease',
    delay: 0,
    ignoreReducedMotion: false,
    enterKeyframes: { opacity: [0, 1] },
    exitKeyframes: { opacity: [1, 0] },
    contentAlign: 'topLeft',
    positionAnchor: 'topLeft',
    avoidMutationTransition: false,
    transitionRootTag: null,
    mutationTransitionType: 'overlap',
    overflow: 'hidden',
    relevantStyleProperties: [],
    disabled: false,
  },
};

export default defaults;
