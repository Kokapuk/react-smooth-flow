import { PropertiesHyphen } from 'csstype';
import { STYLE_PROPERTIES_TO_CAPTURE } from './defaults';

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
  duration?: number;
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

export type ParsedTransitionProperties = Required<Omit<TransitionProperties, 'exitKeyframes' | 'transitionRootTag'>> & {
  exitKeyframes: Keyframes;
  transitionRootTag: Tag | null;
};

export type TransitionMapping<T extends TransitionProperties | ParsedTransitionProperties = TransitionProperties> =
  Record<Tag, T>;

export interface TransitionConfig {
  noFlushSync?: boolean;
  onBegin?(): void;
  onCancel?(): void;
  onFinish?(): void;
}

export type ComputedStyle = Record<(typeof STYLE_PROPERTIES_TO_CAPTURE)[number], string>;

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

export interface Transition {
  snapshot: Snapshot;
  animation: Animation;
  onCancel(): void;
}

export type Falsy = false | 0 | '' | null | undefined;
export type FalsyArray<T> = (T | Falsy)[];
