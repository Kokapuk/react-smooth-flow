export interface Bounds {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
  scrollBarWidth: number;
  scrollBarHeight: number;
}

export type MutationTransitionType = 'overlap' | 'sequential';

export type ContentAlign =
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'centerRight'
  | 'bottomRight'
  | 'bottomCenter'
  | 'bottomLeft'
  | 'centerLeft'
  | 'center';

export type Origin = 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft';

export type ImageOverflow = 'hidden' | 'visible';

export interface Keyframe {
  offset?: number;
  [key: string]: string | number | undefined;
}

export interface PropertyIndexedKeyframes {
  offset?: number[];
  [key: string]: string[] | number[] | undefined;
}

export type Keyframes = Keyframe[] | PropertyIndexedKeyframes;

export interface TransitionProperties {
  duration: number;
  easing?: string;
  delay?: number;
  ignoreReducedMotion?: boolean;
  enterKeyframes?: Keyframes;
  exitKeyframes?: Keyframes | 'reversedEnter';
  contentAlign?: ContentAlign;
  origin?: Origin;
  avoidMutationTransition?: boolean;
  transitionRootTag?: string;
  mutationTransitionType?: MutationTransitionType;
  overflow?: ImageOverflow;
}

export interface ParsedTransitionProperties extends Required<TransitionProperties> {
  exitKeyframes: Keyframes;
}

export type TransitionMapping<T extends TransitionProperties = TransitionProperties> = Record<string, T>;

export interface TransitionConfig {
  noFlushSync?: boolean;
  onBegin?(): void;
  onCancel?(): void;
  onFinish?(): void;
}

export type ComputedStyle = Omit<
  CSSStyleDeclaration,
  | 'item'
  | 'getPropertyPriority'
  | 'getPropertyValue'
  | 'removeProperty'
  | 'setProperty'
  | 'cssProperty'
  | 'cssText'
  | 'length'
  | 'parentRule'
  | number
  | typeof Symbol.iterator
>;

export interface Snapshot {
  tag: string;
  bounds: Bounds;
  image: HTMLDivElement;
  computedStyle: ComputedStyle;
  transitionProperties: ParsedTransitionProperties;
  hasFixedPosition: boolean;
  transitionRoot?: HTMLElement | null;
  targetElement: HTMLElement;
}

export interface TransitionSnapshot {
  transition: Animation;
  onCancel(): void;
}
