import { Properties, PropertiesHyphen } from 'csstype';

export type Tag = string;

export interface Keyframe {
  offset?: number;
  [key: string]: string | number | undefined;
}

export interface PropertyIndexedKeyframes {
  offset?: number[];
  [key: string]: string[] | number[] | undefined;
}

export type Keyframes = Keyframe[] | PropertyIndexedKeyframes;

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

export type PositionAnchor = 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft';

export type MutationTransitionType = 'overlap' | 'sequential';

export type ImageOverflow = 'hidden' | 'visible';

export type RelevantStyleProperties = Exclude<keyof PropertiesHyphen, 'pointer-events'>[];

export interface TransitionProperties {
  duration: number;
  easing?: string;
  delay?: number;
  ignoreReducedMotion?: boolean;
  enterKeyframes?: Keyframes;
  exitKeyframes?: Keyframes | 'reversedEnter';
  contentAlign?: ContentAlign;
  positionAnchor?: PositionAnchor;
  avoidMutationTransition?: boolean;
  transitionRootTag?: Tag;
  mutationTransitionType?: MutationTransitionType;
  overflow?: ImageOverflow;
  relevantStyleProperties?: RelevantStyleProperties;
  disabled?: boolean;
}

export interface ParsedTransitionProperties extends Required<TransitionProperties> {
  exitKeyframes: Keyframes;
}

export type TransitionMapping<T extends TransitionProperties = TransitionProperties> = Record<Tag, T>;

export interface TransitionConfig {
  noFlushSync?: boolean;
  onBegin?(): void;
  onCancel?(): void;
  onFinish?(): void;
}

export type ComputedStyle = Record<keyof Properties, string>;

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

export interface Snapshot {
  tag: Tag;
  bounds: Bounds;
  image: HTMLDivElement;
  computedStyle: ComputedStyle;
  transitionProperties: ParsedTransitionProperties;
  hasFixedPosition: boolean;
  transitionRoot?: HTMLElement | null;
  targetElement: HTMLElement;
  totalZIndex: number;
}

export interface TransitionSnapshot {
  snapshot: Snapshot;
  transition: Animation;
  onCancel(): void;
}

export type Falsy = false | 0 | '' | null | undefined;
export type FalsyArray<T> = (T | Falsy)[];
