import { Properties } from 'csstype';
import { ParsedTransitionOptions, Snapshot, TransitionOptions } from './types';

export interface ConfigurableDefaults {
  debug: boolean;
  transitionOptions: ParsedTransitionOptions;
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
  'pointerEvents',
  'margin',
  'display',
] as const satisfies Readonly<(keyof Properties)[]>;

export const STYLE_PROPERTIES_TO_APPLY_TO_IMAGE = [
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
  'pointerEvents',
] as const satisfies Readonly<(typeof STYLE_PROPERTIES_TO_CAPTURE)[number][]>;

export const STYLE_PROPERTIES_TO_ANIMATE = [
  'opacity',
  'backgroundColor',
  'boxShadow',
  'borderRadius',
  'borderWidth',
  'borderColor',
  'borderStyle',
] as const satisfies Readonly<(typeof STYLE_PROPERTIES_TO_CAPTURE)[number][]>;

export const CONSISTENT_TRANSITION_OPTIONS = [
  'duration',
  'easing',
  'delay',
  'ignoreReducedMotion',
  'scaleContent',
  'positionAnchor',
  'transitionRootTag',
  'forcePresenceTransition',
  'clip',
  'transitionLayout',
] as const satisfies Readonly<(keyof TransitionOptions)[]>;

export const CONSISTENT_SNAPSHOT_PROPERTIES = ['tag', 'transitionRoot'] as const satisfies Readonly<(keyof Snapshot)[]>;

const defaults: ConfigurableDefaults = {
  debug: false,
  transitionOptions: {
    duration: 300,
    easing: 'ease',
    delay: 0,
    ignoreReducedMotion: false,
    enterKeyframes: { opacity: [0, 1] },
    exitKeyframes: { opacity: [1, 0] },
    contentEnterKeyframes: { opacity: [0, 1, 1] },
    contentExitKeyframes: { opacity: [1, 1, 0] },
    scaleContent: false,
    contentAlign: 'topLeft',
    positionAnchor: 'topLeft',
    forcePresenceTransition: false,
    transitionRootTag: null,
    clip: true,
    relevantStyleProperties: [],
    persistBounds: true,
    transitionLayout: false,
    disabled: false,
  },
};

export default defaults;
