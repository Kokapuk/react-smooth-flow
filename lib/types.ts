import { PropertiesHyphen } from 'csstype';
import {
  CONSISTENT_SNAPSHOT_PROPERTIES,
  CONSISTENT_TRANSITION_PROPERTIES,
  STYLE_PROPERTIES_TO_CAPTURE,
} from './defaults';

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

export type SharedTransitionProperties = Pick<
  ParsedTransitionProperties,
  (typeof CONSISTENT_TRANSITION_PROPERTIES)[number]
>;

export type SnapshotPairSharedData = Required<Pick<Snapshot, (typeof CONSISTENT_SNAPSHOT_PROPERTIES)[number]>> & {
  transitionProperties: SharedTransitionProperties;
};

export type SnapshotPairTransitionType = 'mutation' | 'enterExit';

export type SnapshotPair<T extends SnapshotPairTransitionType> = {
  prevSnapshot: T extends 'mutation' ? Snapshot : Snapshot | null;
  nextSnapshot: T extends 'mutation' ? Snapshot : Snapshot | null;
  firstValidSnapshot: Snapshot;
  shared: SnapshotPairSharedData;
  transitionType: T;
} & (T extends 'mutation'
  ? { image: HTMLDivElement }
  : { prevImage: HTMLDivElement | null; nextImage: HTMLDivElement | null });

export interface Transition {
  snapshotPairSharedData: SnapshotPairSharedData;
  animation: Animation;
  cleanup(): void;
}

export type Falsy = false | 0 | '' | null | undefined;
export type FalsyArray<T> = (T | Falsy)[];
