import { Properties, PropertiesHyphen } from 'csstype';
import { ResolvedTransitionOptions, Snapshot, TransitionOptions } from './types';

export interface ConfigurableDefaults {
  debug: boolean;
  transitionOptions: ResolvedTransitionOptions;
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
  'transformOrigin',
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
  'transformOrigin',
] as const satisfies Readonly<(typeof STYLE_PROPERTIES_TO_CAPTURE)[number][]>;

export const STYLE_PROPERTIES_TO_RESET_ON_IMAGE = {
  'background-color': 'transparent',
  'border-radius': '0',
  'border-width': '0',
  position: 'static',
  margin: '0',
  opacity: '1',
  'box-shadow': 'none',
  'backdrop-filter': 'none',
  transform: 'none',
} as const satisfies Readonly<PropertiesHyphen<string>>;

export const STYLE_PROPERTIES_TO_ANIMATE = [
  'opacity',
  'backgroundColor',
  'boxShadow',
  'borderRadius',
  'borderWidth',
  'borderColor',
  'borderStyle',
  'transformOrigin',
] as const satisfies Readonly<(typeof STYLE_PROPERTIES_TO_CAPTURE)[number][]>;

export const CONSISTENT_TRANSITION_OPTIONS = [
  'duration',
  'easing',
  'delay',
  'ignoreReducedMotion',
  'positionAnchor',
  'root',
  'forcePresenceTransition',
  'clip',
  'captureTransform',
] as const satisfies Readonly<(keyof TransitionOptions)[]>;

export const CONSISTENT_SNAPSHOT_PROPERTIES = ['tag', 'root'] as const satisfies Readonly<(keyof Snapshot)[]>;

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
    root: undefined,
    clip: true,
    relevantStyleProperties: [],
    persistBounds: true,
    transitionLayout: false,
    captureDynamicStates: false,
    captureTransform: false,
    disabled: false,
  },
};

export default defaults;
